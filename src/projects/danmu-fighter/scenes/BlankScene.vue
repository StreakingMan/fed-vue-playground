<template>
    <div class="d-flex align-center justify-center full-height full-width">
        <div class="blank-scene elevation-2 bg-color-white">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BlankScene',
});
</script>

<style scoped lang="scss">
.blank-scene {
    width: 1000px;
    height: 1000px;
    position: relative;
}
</style>
