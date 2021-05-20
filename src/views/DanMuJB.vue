<template>
    <div
        class="
            d-flex
            align-center
            justify-center
            flex-column
            full-height full-width
        "
    >
        <div class="d-flex ma-4">
            <MyButton color="danger" class="mr-2" @click="start">
                START
            </MyButton>
            <MyButton color="danger" class="mr-2" @click="stop">STOP</MyButton>
            <h1>{{ userName }}:{{ msg }}</h1>
        </div>

        <BlankScene>
            <JetFighter
                name="喷射战士一号"
                :init-position="{ x: 100, y: 100 }"
            ></JetFighter>
            <JetFighter color="red" name="喷射战士2号"></JetFighter>
            <JetFighter
                color="grey"
                name="喷射战士3号"
                :init-position="{ x: 200, y: 200 }"
            ></JetFighter>
            <JetFighter
                color="orange"
                name="喷射战士4号"
                :init-position="{ x: 300, y: 300 }"
            ></JetFighter>
        </BlankScene>
    </div>
</template>

<script>
import JetFighter from '../projects/danmu-fighter/roles/JetFighter.vue';
import BlankScene from '../projects/danmu-fighter/scenes/BlankScene.vue';
import { MiniEngine } from '../projects/danmu-fighter/classes/MiniEngine';
import { defineComponent, onMounted, onUnmounted, provide, ref } from 'vue';
import { getBiliBiliDanmuInfo } from '../projects/danmu-fighter/service';
import { createWebsocket } from '../projects/danmu-fighter/utils/websocket';
import {
    decode,
    encode,
} from '../projects/danmu-fighter/utils/bilibili-ws-data-helper';
import MyButton from '../ui/MyButton.vue';
export default defineComponent({
    name: 'DanMuJB',
    components: { MyButton, BlankScene, JetFighter },
    setup() {
        // 初始化引擎
        const engine = new MiniEngine({
            globalWidth: 800,
            globalHeight: 800,
            intervalTime: 160,
            unit: 50,
        });
        // 引擎注入
        provide('engine', engine);
        onMounted(() => {
            engine.start();
        });
        onUnmounted(() => {
            engine.stop();
        });

        const roomId = ref(1161592);
        const userName = ref('');
        const msg = ref('');

        getBiliBiliDanmuInfo(roomId.value).then(({ host_list, token }) => {
            const node = host_list[0];
            const ws = createWebsocket(`wss://${node.host}/sub`, {
                onopen() {
                    ws.send(
                        encode(
                            JSON.stringify({
                                uid: 0,
                                roomid: roomId.value,
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
                                msg.value = info[1];
                                userName.value = info[2][1];
                                engine.roleList[1].addCommands([
                                    info[1],
                                    info[1],
                                    info[1],
                                ]);
                            }
                        });
                    });
                },
            });
            setInterval(() => {
                ws.send(encode('', 2));
            }, 1000 * 10);

            // 随机测试指令
            setInterval(() => {
                const cmd1 = ['上', '下', '左', '右'][
                    Math.floor(Math.random() * 4)
                ];

                const cmd2 = ['上', '下', '左', '右'][
                    Math.floor(Math.random() * 4)
                ];

                const cmd3 = ['上', '下', '左', '右'][
                    Math.floor(Math.random() * 4)
                ];
                engine.roleList[0].addCommands([cmd1, cmd1]);
                engine.roleList[2].addCommands([cmd2, cmd2]);
                engine.roleList[3].addCommands([cmd3, cmd3]);
            }, 320);
        });

        const start = () => {
            engine.start();
        };
        const stop = () => {
            engine.stop();
        };

        return {
            start,
            stop,
            roomId,
            userName,
            msg,
        };
    },
});
</script>

<style scoped lang="scss">
//
</style>
