<template>
    <svg
        id="图层_1"
        data-name="图层 1"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 160 115"
        style="position: absolute"
        :style="{
            transition: `${transition}ms linear`,
            left: role.canvasInfo.x + 'px',
            top: role.canvasInfo.y + 'px',
            transform: `rotate(${role.canvasInfo.r || 0}deg)`,
        }"
    >
        <title>未标题-1</title>
        <path
            :fill="color"
            d="M181,124H21V60A16,16,0,0,1,37,44H165a16,16,0,0,1,16,16Z"
            transform="translate(-21 -9)"
        />
        <path
            fill="white"
            d="M169.5,49c0,22.09-31.34,40-70,40s-70-17.91-70-40S60.84,9,99.5,9,169.5,26.91,169.5,49ZM99.5,9c-31,0-56.1,14.46-56.1,32.31S68.52,73.62,99.5,73.62s56.1-14.47,56.1-32.31S130.48,9,99.5,9Z"
            transform="translate(0 30) scale(0.8)"
        />
        <circle fill="white" cx="41" cy="32" r="24" />
        <path
            d="M62,18A23,23,0,1,1,39,41,23,23,0,0,1,62,18m0-2A25,25,0,1,0,87,41,25,25,0,0,0,62,16Z"
            transform="translate(-21 -9)"
        />
        <circle fill="white" cx="119" cy="32" r="24" />
        <path
            d="M140,18a23,23,0,1,1-23,23,23,23,0,0,1,23-23m0-2a25,25,0,1,0,25,25,25,25,0,0,0-25-25Z"
            transform="translate(-21 -9)"
        />
        <circle cx="38" cy="45" r="6" />
        <circle cx="122" cy="44" r="6" />
        <rect
            x="37"
            y="35"
            width="50"
            height="6"
            transform="translate(-1.68 -29.88) rotate(22.56)"
        />
        <rect
            x="115"
            y="35"
            width="50"
            height="6"
            transform="translate(-25.01 46.5) rotate(-22.11)"
        />
    </svg>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Role } from '../classes/Role';

export default defineComponent({
    name: 'JetFighter',
    props: {
        color: {
            type: String,
            default: 'black',
        },
        name: {
            type: String,
            default: '喷射战士',
            required: true,
        },
        initPosition: {
            type: Object,
            default: () => ({ x: 0, y: 0 }),
        },
    },
    setup(props) {
        const engine = inject('engine');
        const role = ref(
            new Role(engine, {
                canvasInfo: {
                    x: props.initPosition.x,
                    y: props.initPosition.y,
                    w: 100,
                    h: 100,
                    z: 0,
                },
                name: props.name,
            })
        );
        engine.addRole(role.value);
        return {
            transition: engine.intervalTime,
            role,
        };
    },
});
</script>

<style scoped lang="scss">
//
</style>
