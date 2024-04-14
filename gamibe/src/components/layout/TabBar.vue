<template>
    <nav v-if="!isCreateRoute" class="amazing-tabs bg-blue-900">
        <div class="filters-container">
            <div class="filters-wrapper">
                <ul class="filter-tabs bg-blue-600">
                    <li class="">
                        <button class="filter-button filter-active" data-translate-value="0">
                            New
                        </button>
                    </li>
                    <li>
                        <button class="filter-button" data-translate-value="100%">Popular</button>
                    </li>
                    <li>
                        <button class="filter-button" data-translate-value="200%">Following</button>
                    </li>
                </ul>
                <div class="filter-slider" aria-hidden="true">
                    <div class="filter-slider-rect">&nbsp;</div>
                </div>
            </div>
        </div>
        <div class="main-tabs-container">
            <div class="main-tabs-wrapper">
                <ul class="main-tabs">
                    <RouterLink
                        v-for="(tab, index) in tabs"
                        v-slot="{ href, route, navigate, isActive, isExactActive }"
                        :to="tab.path"
                        :key="tab.path"
                        custom
                    >
                        <li>
                            <button
                                class="round-button"
                                :class="{ active: isActive, 'show-filters': tab.showFilters }"
                                :style="{ '--round-button-active-color': tab.color }"
                                :data-translate-value="index * 100 + '%'"
                                :data-color="tab.color"
                                @click="navigate"
                            >
                                <component :is="tab.icon" />
                            </button>
                        </li>
                    </RouterLink>
                </ul>
                <div class="main-slider" aria-hidden="true">
                    <div
                        class="main-slider-circle cursor-pointer rounded-full bg-slate-200 p-1.5 shadow shadow-blue-600 drop-shadow-[0px_0px_6px_cyan] transition-colors hover:text-blue-500 active:text-blue-700"
                    >
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
        name: 'Home'
        // showFilters: true
    },
    {
        path: '/calendar',
        icon: CalendarDaysIcon,
        color: 'orange',
        name: 'Calendar'
        // showFilters: true
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
const props = defineProps({
    isMobile: Boolean
})

const route = useRoute()

const isCreateRoute = computed(() => route.matched.find((match) => match.name === 'Create'))

onMounted(() => {
    // resources in description
    const mainTabs = document.querySelector('.main-tabs')
    const mainSliderCircle = document.querySelector('.main-slider-circle')
    const roundButtons = document.querySelectorAll('.round-button')

    const colors = {
        blue: {
            50: {
                value: '#e3f2fd'
            },
            100: {
                value: '#bbdefb'
            }
        },
        green: {
            50: {
                value: '#e8f5e9'
            },
            100: {
                value: '#c8e6c9'
            }
        },
        purple: {
            50: {
                value: '#f3e5f5'
            },
            100: {
                value: '#e1bee7'
            }
        },
        orange: {
            50: {
                value: '#ffe0b2'
            },
            100: {
                value: '#ffe0b2'
            }
        },
        red: {
            50: {
                value: '#ffebee'
            },
            100: {
                value: '#ffcdd2'
            }
        }
    }

    const getColor = (color, variant) => {
        return colors[color][variant].value
    }

    const handleActiveTab = (tabs, event, className) => {
        tabs.forEach((tab) => {
            tab.classList.remove(className)
        })

        if (!event.target.classList.contains(className)) {
            event.target.classList.add(className)
        }
    }

    mainTabs.addEventListener('click', (event) => {
        const root = document.documentElement
        const targetColor = event.target.dataset.color
        const targetTranslateValue = event.target.dataset.translateValue

        if (event.target.classList.contains('round-button')) {
            mainSliderCircle.classList.remove('animate-jello')
            void mainSliderCircle.offsetWidth
            mainSliderCircle.classList.add('animate-jello')

            root.style.setProperty('--translate-main-slider', targetTranslateValue)
            root.style.setProperty('--main-slider-color', getColor(targetColor, 50))
            root.style.setProperty('--background-color', getColor(targetColor, 100))

            handleActiveTab(roundButtons, event, 'active')

            if (!event.target.classList.contains('show-filters')) {
                root.style.setProperty('--filters-container-height', '0')
                root.style.setProperty('--filters-wrapper-opacity', '0')
            } else {
                root.style.setProperty('--filters-container-height', '3.8em')
                root.style.setProperty('--filters-wrapper-opacity', '1')
            }
        }
    })

    const filterTabs = document.querySelector('.filter-tabs')
    const filterButtons = document.querySelectorAll('.filter-button')

    filterTabs.addEventListener('click', (event) => {
        const root = document.documentElement
        const targetTranslateValue = event.target.dataset.translateValue

        if (event.target.classList.contains('filter-button')) {
            root.style.setProperty('--translate-filters-slider', targetTranslateValue)
            handleActiveTab(filterButtons, event, 'filter-active')
        }
    })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

:root {
    --background-color: #bbdefb;
    --blue-50: #e3f2fd;
    --blue-100: #bbdefb;
    --blue-A700: rgb(41, 98, 255);
    --green-50: #e8f5e9;
    --green-100: #c8e6c9;
    --green-A700: #00c853;
    --purple-50: #f3e5f5;
    --purple-100: #e1bee7;
    --purple-A700: #aa00ff;
    --orange-50: #fff3e0;
    --orange-100: #ffe0b2;
    --orange-A700: #ff6d00;
    --orange-700: #f57c00;
    --grey-900: #212121;
    --white: #ffffff;
    --round-button-active-color: #212121;
    --translate-main-slider: 100%;
    --main-slider-color: #e3f2fd;
    --translate-filters-slider: 0;
    --filters-container-height: 3.8em;
    --filters-wrapper-opacity: 1;
}

button {
    border: none;
    cursor: pointer;
    background-color: transparent;
    outline: none;
}

nav.amazing-tabs {
    border-radius: 2.5em 2.5em 0 0;
    user-select: none;
    padding-top: 1em;
    font-size: 56%;
}

.main-tabs-container {
    padding: 0 1em 1em 1em;
}

.main-tabs-wrapper {
    position: relative;
}

ul.main-tabs,
ul.filter-tabs {
    list-style-type: none;
    display: flex;
}

ul.main-tabs li {
    display: inline-flex;
    position: relative;
    padding: 1.5em;
    z-index: 1;
}

.avatar,
.avatar img {
    height: 4em;
    width: 4em;
    border-radius: 50%;
    pointer-events: none;
}

.avatar img {
    object-fit: cover;
}

.round-button {
    height: 4.8em;
    width: 4.8em;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--grey-900);
    transition: color 0.2s ease-in-out;
}

.round-button:hover,
.round-button.active {
    color: var(--round-button-active-color);
}

.round-button svg {
    pointer-events: none;
    height: 2.8em;
    width: 2.8em;
    transform: translate(0, 0);
}

.main-slider {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 1.5em;
    z-index: 0;
    transition: transform 0.4s ease-in-out;
    transform: translateX(var(--translate-main-slider));
}

.main-slider-circle {
    height: 4.8em;
    width: 4.8em;
    border-radius: 50%;
    transition: background-color 0.4s ease-in-out;
    /* background-color: var(--main-slider-color); */
}

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

.filters-container {
    overflow: hidden;
    padding: 0 3em;
    transition: max-height 0.4s ease-in-out;
    max-height: var(--filters-container-height);
}

.filters-wrapper {
    position: relative;
    transition: opacity 0.2s ease-in-out;
    opacity: var(--filters-wrapper-opacity);
}

.filter-tabs {
    border-radius: 1em;
    padding: 0.3em;
    overflow: hidden;
    background-color: var(--orange-50);
}

.filter-tabs li {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1 0 33.33%;
}

.filter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.8em;
    flex-grow: 1;
    height: 3em;
    padding: 0 1.5em;
    color: var(--orange-700);
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: 1.4em;
}

.filter-button.filter-active {
    transition: color 0.4s ease-in-out;
    color: var(--grey-900);
}

.filter-slider {
    pointer-events: none;
    position: absolute;
    padding: 0.3em;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.filter-slider-rect {
    height: 3em;
    width: 33.33%;
    border-radius: 0.8em;
    background-color: var(--white);
    box-shadow: 0 0.1em 1em -0.4em rgba(0, 0, 0, 0.12);
    transition: transform 0.4s ease-in-out;
    transform: translateX(var(--translate-filters-slider));
}
</style>
