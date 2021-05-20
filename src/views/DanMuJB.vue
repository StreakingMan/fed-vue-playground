<template>
    <BlankScene>
        <JetFighter></JetFighter>
    </BlankScene>
</template>

<script>
import JetFighter from '../projects/danmu-fighter/roles/JetFighter.vue';
import BlankScene from '../projects/danmu-fighter/scenes/BlankScene.vue';
import { MiniEngine } from '../projects/danmu-fighter/classes/MiniEngine';
import { defineComponent, onMounted, onUnmounted, provide } from 'vue';
import { getBiliBiliDanmuInfo } from '../projects/danmu-fighter/service';
import { createWebsocket } from '../projects/danmu-fighter/utils/websocket';
import {
    decode,
    encode,
} from '../projects/danmu-fighter/utils/bilibili-ws-data-helper';
export default defineComponent({
    name: 'DanMuJB',
    components: { BlankScene, JetFighter },
    setup() {
        const engine = new MiniEngine({
            globalWidth: 1000,
            globalHeight: 1000,
            intervalTime: 1000,
            unit: 100,
        });
        provide('engine', engine);
        onMounted(() => {
            engine.start();
        });
        onUnmounted(() => {
            engine.stop();
        });

        const roomId = 8324350;

        getBiliBiliDanmuInfo(roomId).then(({ host_list, token }) => {
            const node = host_list[0];
            const ws = createWebsocket(`wss://${node.host}/sub`, {
                onopen() {
                    ws.send(
                        encode(
                            JSON.stringify({
                                uid: 0,
                                roomid: roomId,
                                protover: 2,
                                platform: 'web',
                                type: 2,
                                key: token,
                            }),
                            7
                        )
                    );
                },
                onclose() {
                    console.log('close');
                },
                onerror() {
                    console.log('error');
                },
                onmessage({ data }) {
                    decode(data).then(({ op, body }) => {
                        if (op !== 5) return;
                        body.forEach(({ cmd, info }) => {
                            if (cmd === 'DANMU_MSG') {
                                const msg = info[1];
                                const userName = info[2][1];
                                engine.roleList[0].addCommand(msg);
                            }
                        });
                    });
                },
            });
            setInterval(() => {
                ws.send(encode('', 2));
            }, 1000 * 10);
        });
    },
});
</script>

<style scoped lang="scss">
//
</style>
