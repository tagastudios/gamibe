<template>
    <div
        ref="cardRef"
        class="flex w-full cursor-pointer select-none flex-col gap-2 rounded-lg bg-gradient-to-br to-transparent p-2 text-zinc-200 shadow-inner ring-1"
        :class="`${
            type === 'bill'
                ? 'from-red-950 shadow-red-500  ring-red-500'
                : 'from-green-950 shadow-green-500  ring-green-500 '
        }`"
        @click.stop="toggleCard"
    >
        <div class="flex w-full items-center justify-between gap-2">
            <component
                :is="categoryMapper[category] ?? QuestionMarkCircleIcon"
                :class="`aspect-square w-[14%] max-w-16 rounded-full p-0`"
                :style="{
                    backgroundColor: bgColor,
                    color: textColor
                }"
            />
            <div class="flex-1 flex-col justify-center truncate pb-1">
                <h3 class="truncate text-lg font-semibold capitalize md:text-xl">
                    {{ name }}
                </h3>
                <p class="truncate text-sm capitalize text-zinc-300 md:text-base">
                    {{ exactDate ? formattedExactDate : formattedTimeAgoDate }}
                </p>
            </div>
            <p class="min-w-max text-right text-base font-semibold md:text-lg lg:text-xl">
                {{ formattedBillAmount }}
            </p>
        </div>
        <div
            class="max-h- overflow-hidden transition-all duration-500"
            :class="shouldExpand ? 'mb-0 max-h-40' : '-mb-2 max-h-0'"
        >
            <div
                class="relative transition-opacity duration-500"
                :class="shouldExpand ? 'opacity-100' : 'opacity-0'"
            >
                <hr
                    class="shadow-sm ring-1"
                    :class="`${
                        type === 'bill'
                            ? 'border-red-500 shadow-red-500  ring-red-600'
                            : 'border-green-500 shadow-green-500  ring-green-600 '
                    }`"
                />
                <div class="my-2 flex w-full justify-between">
                    <div>
                        <p v-if="nickname" class="capitalize">Nickname: {{ nickname }}</p>
                        <p v-if="frequency" class="capitalize">Frequency: {{ frequency }}</p>
                        <p v-if="website" class="capitalize">Website: {{ website }}</p>
                    </div>
                    <div class="text-right text-xs md:text-sm">
                        <p>Since</p>
                        <p>{{ formattedSinceDate }}</p>
                    </div>
                </div>
                <div class="flex w-full items-center">
                    <button
                        @click.self="showDeleteOptions = !showDeleteOptions"
                        class="h-8 w-full rounded-bl-md border-[0.5px] border-zinc-600 shadow-inner shadow-zinc-600 active:bg-zinc-500"
                    >
                        Delete
                    </button>
                    <button
                        @click.self="cardAction('edit', id)"
                        class="h-8 w-full border-[0.5px] border-zinc-600 shadow-inner shadow-zinc-600 active:bg-zinc-500"
                    >
                        Edit
                    </button>
                    <button
                        @click.self="cardAction('paid', id)"
                        class="h-8 w-full rounded-br-md border-[0.5px] border-zinc-600 shadow-inner shadow-zinc-600"
                        :class="
                            paid ? ' bg-zinc-500 bg-opacity-25 text-zinc-500' : 'active:bg-zinc-500'
                        "
                    >
                        {{ paid ? 'Unpaid' : 'Paid' }}
                    </button>
                </div>
                <Transition name="fadeShrink">
                    <div
                        ref="deleteMenuRef"
                        v-if="showDeleteOptions"
                        class="flex w-full items-center"
                    >
                        <button
                            @click.self="cardAction('delete-all', id)"
                            class="h-8 w-full rounded-bl-md border-[0.5px] border-zinc-600 shadow-inner shadow-zinc-600 active:bg-zinc-500"
                        >
                            All Series
                        </button>
                        <button
                            @click.self="cardAction('delete-this', id)"
                            class="h-8 w-full rounded-br-md border-[0.5px] border-zinc-600 shadow-inner shadow-zinc-600 active:bg-zinc-500"
                        >
                            Only This Date
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimeAgo, useDateFormat } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import {
    QuestionMarkCircleIcon,
    ComputerDesktopIcon,
    ShoppingBagIcon,
    BanknotesIcon
} from '@heroicons/vue/24/solid'
import { useCurrency } from '@/composables/shared/useHelpers'

const { formatCurrency } = useCurrency()

const emit = defineEmits(['select-card', 'delete-all', 'delete-this', 'paid', 'edit'])

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    website: {
        type: String
    },
    since: {
        type: null
    },
    exactDate: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'bill'
    },
    paid: {
        type: Boolean,
        default: false
    },
    expand: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true
    }
})

// Expand Card
const _expand = ref(false)
const shouldExpand = computed(() => _expand.value && props.expand)

const toggleCard = () => {
    if (!showDeleteOptions.value) {
        _expand.value = !_expand.value
    }
    // _expand.value = showDeleteOptions.value ? true : !_expand.value
    emit('select-card', _expand.value ? props.id : null)
}

// Click Outside
const cardRef = ref(null)
onClickOutside(cardRef, () => {
    showDeleteOptions.value = false
    _expand.value = false
    emit('select-card', null)
})

// Delete Options
const deleteMenuRef = ref(null)
const showDeleteOptions = ref(false)
onClickOutside(deleteMenuRef, () => {
    if (!shouldExpand.value) showDeleteOptions.value = false
})

// Actions & Emits
const cardAction = (action: string, id: string) => {
    emit(action as 'delete-all' | 'delete-this' | 'paid' | 'edit', id)
}

// Icons & Categories
const categoryMapper: { [key: string]: any } = {
    subscription: ComputerDesktopIcon,
    shopping: ShoppingBagIcon,
    salary: BanknotesIcon
}

const colorMapper: { [key: string]: any } = {
    subscription: {
        bg: '#ffedd5',
        color: '#fdba74'
    },
    shopping: {
        bg: '#fee2e2',
        color: '#fca5a5'
    },
    salary: {
        bg: '#d1fae5',
        color: '#6ee7b7'
    }
}

const textColor = computed(() => {
    if (categoryMapper[props.category]) {
        return colorMapper[props.category].color
    } else {
        return '#475569'
    }
})

const bgColor = computed(() => {
    if (categoryMapper[props.category]) {
        return colorMapper[props.category].bg
    } else {
        return '#d4d4d8'
    }
})

// Formatters
const formattedBillAmount = computed(() => formatCurrency(props.amount))

const formattedTimeAgoDate = useTimeAgo(props.date)
const formattedExactDate = useDateFormat(props.date, 'MM/DD/YY')
const formattedSinceDate = useDateFormat(props.since.toDate(), 'MM/DD/YY')
</script>

<style scoped>
@keyframes fadeShrinkIn {
    from {
        opacity: 0;
        transform: scaleY(0);
        max-height: 0;
    }
    50% {
        opacity: 0;
    }
    to {
        opacity: 1;
        transform: scaleY(1);
        max-height: 50px;
    }
}

@keyframes fadeShrinkOut {
    from {
        opacity: 1;
        transform: scaleY(1);
        max-height: 50px;
    }
    25% {
        opacity: 0;
    }
    to {
        opacity: 0;
        transform: scaleY(0);
        max-height: 0;
    }
}

.fadeShrink-enter-active {
    animation: fadeShrinkIn 0.75s;
    transform-origin: top;
}

.fadeShrink-leave-active {
    animation: fadeShrinkOut 0.75s;
    transform-origin: top;
}
</style>
