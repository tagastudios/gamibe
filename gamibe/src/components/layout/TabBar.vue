<template>
    <nav v-if="!isCreateRoute" ref="menuRef" class="w-full rounded-t-2xl bg-blue-900 pt-3">
        <div
            class="overflow-hidden px-4 transition-all duration-500"
            :class="showFilters ? 'mb-4  mt-2 max-h-12' : 'mb-0  max-h-0'"
        >
            <div
                class="relative transition-opacity duration-500"
                :class="showFilters ? 'opacity-100' : 'opacity-0'"
            >
                <ul class="flex overflow-hidden rounded-xl bg-blue-700 py-4">
                    <li
                        v-for="(filter, index) in filters"
                        :key="filter.id || index"
                        class="relative z-10 flex flex-grow bg-transparent"
                        :style="{ flexBasis: 100 / filters.length + '%' }"
                    >
                        <button
                            class="flex h-4 w-full flex-grow items-center justify-center rounded bg-transparent px-2 text-center text-sm font-light transition-all duration-500"
                            :class="`
                                ${
                                    filter.isActive
                                        ? 'font-[600] text-black'
                                        : 'font-[300] text-gray-300'
                                } 
                                ${
                                    filter.disabled
                                        ? 'cursor-not-allowed text-opacity-50'
                                        : 'cursor-pointer'
                                }
                            `"
                            :disabled="filter.disabled"
                            @click="selectFilter(filter)"
                        >
                            {{ filter.name }}
                        </button>
                    </li>
                </ul>
                <div class="absolute inset-0 z-0 p-1.5" aria-hidden="true">
                    <div
                        class="h-full rounded-lg bg-blue-300 shadow transition-transform duration-500"
                        :style="filterTabPosition"
                    >
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>
        <div class="px-5 pb-5 pt-2">
            <div class="relative">
                <ul ref="tabsRef" class="flex list-none items-center justify-between">
                    <RouterLink
                        v-for="(tab, index) in tabs"
                        v-slot="{ href, route, navigate, isActive, isExactActive }"
                        :to="tab.path"
                        :key="tab.path"
                        custom
                    >
                        <li class="relative z-10 inline-flex p-2">
                            <button
                                class="inline-flex aspect-square w-8 items-center justify-center rounded-full transition-colors duration-300"
                                :class="
                                    isActive
                                        ? 'text-blue-600 hover:text-blue-600'
                                        : 'text-slate-400 hover:text-slate-500'
                                "
                                @click="navigateAndAnimate(navigate, index)"
                            >
                                <component
                                    :is="tab.icon"
                                    class="aspect-square w-full translate-x-0 translate-y-0"
                                />
                            </button>
                        </li>
                    </RouterLink>
                </ul>
                <div
                    class="absolute left-0 top-0 z-0 transition-all duration-500"
                    :style="circleSliderPosition"
                    aria-hidden="true"
                >
                    <div
                        ref="circleSliderRef"
                        class="aspect-square w-12 cursor-pointer rounded-full bg-slate-200 p-1.5 shadow shadow-blue-600 drop-shadow-[0px_0px_6px_cyan] transition-colors"
                    />
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
    RectangleGroupIcon,
    Cog6ToothIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    UserGroupIcon
} from '@heroicons/vue/24/solid'
import { onClickOutside } from '@vueuse/core'

// Router
const route = useRoute()
const isCreateRoute = computed(() => route.matched.find((match) => match.name === 'Create'))

// Click Outside
const menuRef = ref(null)
onClickOutside(menuRef, () => {
    showFilters.value = false
})

// Tabs
const tabs = [
    {
        path: '/',
        icon: RectangleGroupIcon,
        name: 'Home',
        showFilters: true
    },
    {
        path: '/calendar',
        icon: CalendarDaysIcon,
        name: 'Calendar',
        showFilters: true
    },
    // {
    //     path: '/charts',
    //     icon: ChartPieIcon,
    //     name: 'Charts'
    // },
    // {
    //     path: '/social',
    //     icon: UserGroupIcon,
    //     name: 'Social'
    // },
    {
        path: '/profile',
        icon: Cog6ToothIcon,
        name: 'Profile'
    }
]

const selectedTabIndex = ref(0)

const tabsRef: any = ref(null)
const activeTabEl: any = computed(() => {
    return tabsRef.value?.children[selectedTabIndex.value]
})

const circleSliderRef: any = ref(null)
const circleSliderPosition = computed(() => {
    const left = activeTabEl.value?.offsetLeft
    return `
        left: calc(${left}px);
    `
})

const navigateAndAnimate = (navigate: Function, targetIndex: number) => {
    navigate()
    selectedTabIndex.value = targetIndex
    if (circleSliderRef.value) {
        circleSliderRef.value.classList.remove('animate-jello')
        void circleSliderRef.value.offsetWidth
        circleSliderRef.value.classList.add('animate-jello')
    }
    const selectedTab = tabs[targetIndex]
    if (selectedTab.showFilters) {
        showFilters.value = true
    } else {
        showFilters.value = false
    }
}

// Filters
const filters = [
    {
        id: 'all',
        name: 'All',
        isActive: true,
        disabled: false
    },
    {
        id: 'income',
        name: 'Income',
        isActive: false,
        disabled: false
    },
    {
        id: 'expense',
        name: 'Expense',
        isActive: false,
        disabled: false
    },
    {
        id: 'saving',
        name: 'Saving',
        isActive: false,
        disabled: true
    }
]

const showFilters = ref(false)
const selectedFilterIndex = ref(0)

const filterTabPosition = computed(() => {
    return {
        transform: 'translateX(' + selectedFilterIndex.value + '00%)',
        width: 100 / filters.length + '%'
    }
})

const selectFilter = (filter: any) => {
    filters.forEach((f) => {
        f.isActive = f.id === filter.id
    })
    selectedFilterIndex.value = filters.findIndex((f: any) => f.id === filter.id)
}
</script>

<style scoped>
.animate-jello {
    animation: jello-horizontal 0.9s both;
}

@keyframes jello-horizontal {
    0% {
        transform: scale3d(1, 1, 1);
    }
    30% {
        transform: scale3d(1.25, 0.75, 1);
    }
    40% {
        transform: scale3d(0.75, 1.25, 1);
    }
    50% {
        transform: scale3d(1.15, 0.85, 1);
    }
    65% {
        transform: scale3d(0.95, 1.05, 1);
    }
    75% {
        transform: scale3d(1.05, 0.95, 1);
    }
    100% {
        transform: scale3d(1, 1, 1);
    }
}
</style>
