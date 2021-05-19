<template>
    <div
        class="
            my-nav-item
            cursor-pointer
            ma-1
            bg-color-success
            hover-elevation-4
            d-flex
            flex-column
            align-center
            justify-center
            color-white
        "
        :class="[active ? `my-nav-item--active` : '']"
        @click="onClick"
    >
        <i
            class="my-nav-item__icon mdi fz-24"
            :class="'mdi-' + (icon || 'application')"
        ></i>
        <span class="my-nav-item__label fz-12">{{ routeName || 'title' }}</span>
    </div>
</template>

<script>
export default {
    name: 'MyNavItem',
    props: {
        routeName: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
    },
    computed: {
        active() {
            return this.$route.name === this.routeName;
        },
    },
    methods: {
        onClick() {
            if (this.routeName) this.$router.push({ name: this.routeName });
        },
    },
};
</script>

<style scoped lang="scss">
@import 'src/styles/color';
@import 'src/styles/elevation';
.my-nav-item {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    transition: 0.16s;
    z-index: 1;
    &__label {
        opacity: 0;
        transition: 0.2s;
        transform: translateY(50%);
    }
    &__icon {
        transform: translateY(6px);
        transition: 0.2s;
    }
    &:hover {
        transform: scale(1.4);
        z-index: 3;
        .my-nav-item {
            &__label {
                opacity: 1;
                display: inline;
                transform: translateY(0);
            }
            &__icon {
                transform: translateY(0);
            }
        }
    }
    &--active {
        transform: scale(1.3);
        z-index: 2;
        @include bgColor('danger');
        @include elevation(4);
    }
}
</style>
