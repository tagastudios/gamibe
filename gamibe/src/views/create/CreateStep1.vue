<template>
    <main>
        <h2 class="text-3xl font-bold text-blue-700">Initiate Your Financial Move..</h2>
        <p class="mb-8 mt-4 text-base">
            Welcome to the heart of financial growth! Choose the type of transaction you'd like to
            make and let's shape your financial destiny.
        </p>
        <div class="mx-auto mt-8 flex w-full max-w-lg flex-col gap-8">
            <RouterLink
                v-for="create in creations"
                :key="create.id"
                :to="`/${create.link}`"
                class="flex h-24 w-full cursor-pointer select-none items-center justify-between rounded-lg bg-blue-700 p-4 outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline"
            >
                <div
                    class="flex aspect-square h-2/3 min-h-[24px] cursor-pointer items-center justify-center rounded-lg bg-blue-900 p-2"
                >
                    <component :is="create.icon ?? QuestionMarkCircleIcon" class="h-full" />
                </div>
                <div class="w-10/12 px-4">
                    <h3
                        class="text-lg underline decoration-blue-950 decoration-wavy decoration-2 underline-offset-2"
                    >
                        {{ create.title }}
                    </h3>
                    <p class="line-clamp-2 text-sm">{{ create.description }}</p>
                </div>
                <div
                    class="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-zinc-100"
                >
                    <ChevronRightIcon
                        class="absolute left-[1px] w-full text-slate-600 transition-colors hover:text-blue-900 active:text-blue-700"
                    />
                </div>
            </RouterLink>
        </div>
    </main>
</template>

<script setup lang="ts">
import {
    ChevronRightIcon,
    QuestionMarkCircleIcon,
    BanknotesIcon,
    ShoppingBagIcon,
    StarIcon,
    CalendarDaysIcon
} from '@heroicons/vue/24/solid'
import { RouterLink } from 'vue-router'

const creations = [
    {
        id: 0,
        title: 'Bill Management',
        description: 'Never miss a due date. Track and manage your bills with ease.',
        icon: CalendarDaysIcon,
        link: 'create/bill'
    },
    {
        id: 1,
        title: 'Earning Power',
        description: `Know when you'll have some power to your favor, track incomes and money flow`,
        icon: BanknotesIcon,
        link: 'create/earning'
    }
    // {
    //     id: 2,
    //     title: 'Smart Spending',
    //     description:
    //         'Prune wisely by tracking your expenses. Financial success is about making informed choices, and this is where it begins.',
    //     icon: ShoppingBagIcon,
    //     link: 'create/expense'
    // },
    // {
    //     id: 3,
    //     title: 'Dream Pursuit',
    //     description:
    //         'Lay the foundation for your dreams. Set and track your financial goals, turning aspirations into achievable milestones.',
    //     icon: StarIcon,
    //     link: 'create/goal'
    // }
    // {
    //     id: 5,
    //     title: 'Financial Wisdom',
    //     description:
    //         'Learn the art of financial management. Get insights and tips to help you make informed decisions.',
    //     icon: QuestionMarkCircleIcon,
    //     link: 'create/insight'
    // }
]
</script>
