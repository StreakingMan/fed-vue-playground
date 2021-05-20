<template>
    <div
        class="blank-scene elevation-2 bg-color-white"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { MiniEngine } from '../classes/MiniEngine';

export default defineComponent({
    name: 'BlankScene',
    setup() {
        const engine: MiniEngine = inject('engine');
        return {
            width: engine.globalWidth,
            height: engine.globalHeight,
        };
    },
});
</script>

<style scoped lang="scss">
.blank-scene {
    position: relative;
}
</style>
