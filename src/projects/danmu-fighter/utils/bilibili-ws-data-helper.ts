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

                    let body;
                    try {
                        // pako可能无法解压
                        body = textDecoder.decode(pako.inflate(data));
                    } catch (e) {
                        body = textDecoder.decode(data);
                    }
                    // 同一条 message 中可能存在多条信息，用正则筛出来
                    // eslint-disable-next-line no-control-regex
                    body?.split(/[\x00-\x1f]+/).forEach((item) => {
                        let parsedItem;
                        try {
                            parsedItem = JSON.parse(item);
                        } catch (e) {
                            // 忽略非 JSON 字符串，通常情况下为分隔符
                        }
                        if (typeof parsedItem === 'object') {
                            // 正常内容
                            result.body.push(parsedItem);
                        } else if (parsedItem !== undefined) {
                            let newBody;
                            try {
                                // 重新尝试用pako toString 解压data
                                newBody = textDecoder.decode(
                                    pako.inflate(data, {
                                        to: 'String',
                                    })
                                );
                            } catch (e) {
                                //
                            }
                            // eslint-disable-next-line no-control-regex
                            newBody?.split(/[\x00-\x1f]+/).forEach((item) => {
                                try {
                                    result.body.push(JSON.parse(item));
                                } catch (e) {
                                    // 忽略非 JSON 字符串，通常情况下为分隔符
                                }
                            });
                        }
                    });
                    offset += packetLen;
                }
            } else if (result.op === 3) {
                result.body = {
                    count: readInt(buffer, 16, 4),
                };
            }
            resolve(result);
        };
        reader.readAsArrayBuffer(blob);
    });
