// 源码来自
// https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md

// @ts-ignore
import pako from 'pako';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

const readInt = (buffer: Uint8Array, start: number, len: number): number => {
    let result = 0;
    for (let i = len - 1; i >= 0; i--) {
        result += 256 ** (len - i - 1) * buffer[start + i];
    }
    return result;
};

const writeInt = function (
    buffer: number[],
    start: number,
    len: number,
    value: number
) {
    let i = 0;
    while (i < len) {
        buffer[start + i] = value / 256 ** (len - i - 1);
        i++;
    }
};

export const encode = (str: string, op: number): ArrayBuffer => {
    const data = textEncoder.encode(str);
    const packetLen = 16 + data.byteLength;
    const header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1];
    writeInt(header, 0, 4, packetLen);
    return new Uint8Array(header.concat(...data)).buffer;
};

export const decode = (blob: Blob) =>
    new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
            // @ts-ignore
            const buffer = new Uint8Array(reader.result);
            const result: Record<string, any> = {};
            result.packetLen = readInt(buffer, 0, 4);
            result.headerLen = readInt(buffer, 4, 2);
            result.ver = readInt(buffer, 6, 2);
            result.op = readInt(buffer, 8, 4);
            result.seq = readInt(buffer, 12, 4);
            if (result.op === 5) {
                result.body = [];
                let offset = 0;
                while (offset < buffer.length) {
                    const packetLen = readInt(buffer, offset + 0, 4);
                    const headerLen = 16; // readInt(buffer,offset + 4,4)
                    const data = buffer.slice(
                        offset + headerLen,
                        offset + packetLen
                    );
                    const body = textDecoder.decode(data);
                    if (body) {
                        try {
                            result.body.push(JSON.parse(body));
                        } catch (e) {
                            const unp = pako.inflate(data, {
                                to: 'string',
                            });
                            try {
                                // TODO 这里可能右多个弹幕
                                const content = JSON.parse(
                                    unp.substr(16, unp.length - 16)
                                );
                                if (content.cmd === 'DANMU_MSG')
                                    resolve({
                                        user: content.info[2]?.[1] || 'unknown',
                                        msg: content.info[1],
                                    });
                            } catch (e) {
                                resolve({
                                    user: 'unknown',
                                    msg: unp,
                                });
                            }
                        }
                    }
                    offset += packetLen;
                }
            } else if (result.op === 3) {
                result.body = {
                    count: readInt(buffer, 16, 4),
                };
            }
            //resolve(result)
        };
        reader.readAsArrayBuffer(blob);
    });
