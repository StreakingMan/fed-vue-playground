<template>
    <MyFloatNavbar v-model:hidden="navHidden">
        <MyNavItem route-name="首页" icon="home"></MyNavItem>
        <MyNavItem route-name="弹幕机霸" icon="robot-angry"></MyNavItem>
        <MyNavItem icon="car-hatchback"></MyNavItem>
        <MyNavItem icon="drama-masks"></MyNavItem>
        <MyNavItem icon="magnet-on"></MyNavItem>
        <MyNavItem></MyNavItem>
        <MyNavItem></MyNavItem>
        <MyNavItem></MyNavItem>
    </MyFloatNavbar>
    <div class="full-width full-height">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MyFloatNavbar from './ui/MyFloatNavbar.vue';
import MyNavItem from './ui/MyNavItem.vue';
export default defineComponent({
    name: 'App',
    components: { MyNavItem, MyFloatNavbar },
    data: () => ({ navHidden: false }),
});
</script>

<style lang="scss">
@import 'styles/color';

#app {
    height: 100vh;
    overflow: hidden;
    @include bgColor('primary');
}
</style>
