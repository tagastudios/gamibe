<template>
    <div
        v-dragscroll
        class="flex min-h-max gap-5 overflow-hidden overflow-x-hidden transition-all duration-300 ease-in-out"
    >
        <slot name="default"></slot>
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'

export default {
    directives: {
        dragscroll
    }
}
</script>
