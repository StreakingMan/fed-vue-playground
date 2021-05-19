<template>
    <div
        class="
            my-float-navbar
            pa-1
            bg-color-white
            elevation-2
            hover-elevation-12
            d-flex
            bdrs-8
            align-center
            justify-center
        "
        :style="{ ...positionStyle }"
    >
        <slot></slot>
        <div
            class="
                my-float-navbar__toggle
                bg-color-white
                cursor-pointer
                d-flex
                align-center
                justify-center
            "
            @click="$emit('update:hidden', !hidden)"
        >
            <i
                class="mdi mdi-arrow-left-bold fz-18"
                :style="{ transform: `rotate(${hidden ? 0 : 180}deg)` }"
            ></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyFloatNavbar',
    props: {
        position: {
            type: String,
            default: 'left',
        },
        hidden: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        positionStyle() {
            const vertical = {
                width: '80px',
                height: 'auto',
                top: '50vh',
                transform: 'translateY(-50%)',
                flexDirection: 'column',
            };
            const horizontal = {
                width: 'auto',
                height: '80px',
                top: '50vw',
                transform: 'translateX(-50%)',
                flexDirection: 'row',
            };

            const directionMap = {
                left: vertical,
                right: vertical,
                top: horizontal,
                bottom: horizontal,
            };

            return {
                [this.position]: this.hidden ? '-96px' : '16px',
                ...directionMap[this.position],
            };
        },
    },
};
</script>

<style scoped lang="scss">
@import 'src/styles/elevation';
.my-float-navbar {
    position: fixed;
    transition: 0.3s;
    // TODO toggle在不同方向的控制
    &__toggle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateX(100%) translateY(-50%);
        width: 48px;
        height: 48px;
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
        transition: 0.3s;
        @include elevation(2);

        i {
            transition: 0.4s;
        }
    }

    &:hover {
        .my-float-navbar__toggle {
            @include elevation(12);
        }
    }
}
</style>
