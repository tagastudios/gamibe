<template>
    <nav v-if="!isCreateRoute" class="w-full rounded-t-2xl bg-blue-900 pt-3">
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
                            :class="
                                filter.isActive
                                    ? 'font-[600] text-black'
                                    : 'font-[300] text-gray-300'
                            "
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
        <div class="px-5 pb-3">
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
                    class="absolute left-0 top-0 z-0 transition-transform duration-500"
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
    RectangleGroupIcon,
    Cog6ToothIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    UserGroupIcon
} from '@heroicons/vue/24/solid'

const tabs = [
    {
        path: '/',
        icon: RectangleGroupIcon,
        color: 'red',
        name: 'Home',
        showFilters: true
    },
    {
        path: '/calendar',
        icon: CalendarDaysIcon,
        color: 'orange',
        name: 'Calendar',
        showFilters: true
    },
    {
        path: '/charts',
        icon: ChartPieIcon,
        color: 'blue',
        name: 'Charts'
    },
    {
        path: '/social',
        icon: UserGroupIcon,
        color: 'green',
        name: 'Social'
    },
    {
        path: '/profile',
        icon: Cog6ToothIcon,
        color: 'purple',
        name: 'Profile'
    }
]
const filters = [
    {
        id: 1,
        name: 'New',
        isActive: true
    },
    {
        id: 2,
        name: 'Popular',
        isActive: false
    },
    {
        id: 3,
        name: 'Following',
        isActive: false
    }
]
const props = defineProps({
    isMobile: Boolean
})

const route = useRoute()

const isCreateRoute = computed(() => route.matched.find((match) => match.name === 'Create'))

const showFilters = ref(false)
const selectedTabIndex = ref(0)
const selectedFilter = ref(0)

const filterTabPosition = computed(() => {
    return {
        transform: 'translateX(' + selectedFilter.value + '00%)',
        width: 100 / filters.length + '%'
    }
})

const selectFilter = (filter: any) => {
    filters.forEach((f) => {
        f.isActive = f.id === filter.id
    })
    selectedFilter.value = filter.id - 1
}

const circleSliderRef: any = ref(null)
const tabsRef: any = ref(null)

const tabsWidth = computed(() => {
    if (tabsRef.value) {
        return tabsRef.value.offsetWidth
    }
    return 0
})

const circleSliderPosition = computed(() => {
    return `transform: translateX(calc(${
        (tabsWidth.value / tabs.length) * selectedTabIndex.value
    }px + ${selectedTabIndex.value * 3}px))`
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
