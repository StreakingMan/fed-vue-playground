export const createWebsocket = (
    url: string,
    opt: any
): WebSocket => {
    const defaultOptions = {
        onmessage: ({ data }: any) => {
            console.log(url, data);
        },
        onopen: () => {
            console.log('ws open ', url);
        },
        onerror: (e: Error) => {
            console.log('ws error, url:' + url, e);
        },
        onclose: () => {
            console.log('ws close ', url);
        },
    };
    opt = Object.assign(defaultOptions, opt);

    const { onmessage, onopen, onerror, onclose } = opt;
    const ws = new WebSocket( url);
    ws.onmessage = onmessage;
    ws.onopen = onopen;
    ws.onerror = onerror;
    ws.onclose = onclose;
    return ws;
};
