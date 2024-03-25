<template>
    <div>
        <div ref="dropdownEl" class="flex w-full items-center justify-stretch">
            <div class="group relative w-full">
                <button
                    @click="dropdownMenuIsOpen = !dropdownMenuIsOpen"
                    id="dropdown-button"
                    :class="{
                        'bg-indigo-100 outline-1': dropdownMenuIsOpen,
                        'outline-0': !dropdownMenuIsOpen
                    }"
                    class="inline-flex w-full justify-between rounded-md border border-indigo-300 bg-transparent px-3 py-2.5 text-sm font-medium shadow-sm outline outline-indigo-300 transition-all active:outline-1 disabled:border-0 disabled:bg-zinc-500"
                >
                    <span
                        v-if="selectedOption"
                        :class="`mr-2 ${dropdownMenuIsOpen ? 'text-slate-800' : 'text-zinc-100 '}`"
                        >{{ selectedOption.title }} - {{ selectedOption.description }}</span
                    >
                    <span
                        v-else
                        :class="`mr-2 ${
                            dropdownMenuIsOpen ? 'text-slate-800' : 'text-indigo-300 '
                        }`"
                        >{{ placeholder }}</span
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="-mr-1 ml-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>

                <Transition :duration="550" name="fade-shrink" appear>
                    <div
                        v-if="dropdownMenuIsOpen"
                        class="outer absolute right-0 z-10 mt-2 w-full space-y-1 rounded-md border border-indigo-300 bg-indigo-100 p-1 shadow-lg outline outline-1 outline-indigo-300 ring-1 ring-black ring-opacity-5"
                    >
                        <!-- Search input -->
                        <input
                            ref="inputRef"
                            id="search-input"
                            class="inner block w-full rounded-md border border-indigo-300 bg-transparent px-4 py-2 text-slate-700 shadow-inner placeholder:text-slate-500 focus:outline-none"
                            type="text"
                            placeholder="Search.."
                            autocomplete="off"
                            v-model.trim="searchInput"
                        />
                        <!-- Dropdown content goes here -->
                        <div
                            v-if="filteredOptions.length > 0"
                            :class="`inner grid grid-cols-${columns} gap-4 rounded-md  px-2 pb-4 pt-2 text-slate-600 shadow-lg`"
                        >
                            <a
                                :class="`focus:shadow-outline flex ${
                                    columns && Number(columns) > 1 ? 'h-20' : 'h-16'
                                } items-center rounded-lg bg-transparent p-2 hover:bg-indigo-200 hover:text-gray-900 focus:outline-none  active:bg-indigo-300 ${
                                    selectedOption?.id == option.id
                                        ? 'bg-indigo-300 text-slate-950 hover:bg-indigo-200 focus:bg-indigo-300'
                                        : ''
                                }}`"
                                href="#"
                                v-for="option in filteredOptions"
                                :key="option.id"
                                @click="selectOption(option)"
                            >
                                <div
                                    :class="`aspect-square shadow shadow-indigo-500 drop-shadow-lg ${
                                        columns && Number(columns) > 1 ? 'h-3/4' : 'h-full'
                                    } rounded-lg bg-sky-500 ${
                                        option.image ? 'p-0' : 'p-3'
                                    } text-white`"
                                >
                                    <img
                                        v-if="option.image"
                                        :src="option.image"
                                        alt=""
                                        class="aspect-square h-full object-cover object-center"
                                    />
                                    <component
                                        v-else
                                        :is="option.icon ?? QuestionMarkCircleIcon"
                                        class="aspect-square h-full"
                                    />
                                </div>
                                <div class="ml-3 w-full">
                                    <p class="line-clamp-1 font-semibold">
                                        {{ option.title }}
                                    </p>
                                    <p class="line-clamp-1 text-sm">{{ option.description }}</p>
                                    <p v-if="columns > 1" class="line-clamp-1 text-sm">
                                        {{ option.extra }}
                                    </p>
                                </div>
                                <div v-if="option.extra && columns == 1" class="ml-6 text-right">
                                    <p class="font-semibold">{{ option.extra }}</p>
                                </div>
                            </a>
                        </div>
                        <div v-else class="py-[34px] text-center text-sm text-slate-700">
                            Sorry, didn't found any option with that parameter!
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { BanknotesIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'

const dropdownEl = ref(null)
onClickOutside(dropdownEl, (e) => {
    if (dropdownMenuIsOpen.value) dropdownMenuIsOpen.value = false
})

const modelValue = defineModel({
    type: Object,
    validator: (value: any) => {
        return (
            (value.id && value.title && value.description) ||
            value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        )
    },
    default: {}
})

defineProps({
    columns: {
        type: Number,
        default: 1
    },
    placeholder: {
        type: String,
        default: 'Open Dropdown'
    }
})

const selectedOption: any = ref(null)

onMounted(() => {
    if (modelValue.value.id) selectedOption.value = modelValue.value
})

const selectOption = (option: any) => {
    dropdownMenuIsOpen.value = false
    selectedOption.value = option
    modelValue.value = option
}

const searchInput: any = ref('')
const inputRef: any = ref(null)
const dropdownMenuIsOpen = ref(false)

watchEffect(() => {
    if (dropdownMenuIsOpen.value) inputRef.value?.focus()
    else searchInput.value = ''
})

const options = defineModel('options', {
    type: Array,
    default: () => [
        {
            id: 1,
            title: 'Bank of America (Example)',
            description: 'Account ending in 5519',
            extra: 'Available: $2,520.75',
            icon: BanknotesIcon,
            image: 'https://freelogopng.com/images/all_img/1658985797bank-of-america-logo.png'
        },
        {
            id: 2,
            title: 'Chase Bank (Example)',
            description: 'Account ending in 7405',
            extra: 'Available: $12,520.23',
            icon: BanknotesIcon,
            image: ''
        }
    ]
})

const filteredOptions: any = computed(() => {
    return options.value.filter((option: any) => {
        return (
            option.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            option.description.toLowerCase().includes(searchInput.value.toLowerCase())
        )
    })
})
</script>

<style scoped>
.inner,
.outer {
    transform-origin: top;
}
.fade-shrink-enter-active {
    transition: all 0.3s ease;
}
.fade-shrink-leave-active {
    transition: all 0.3s 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-shrink-enter-from,
.fade-shrink-leave-to {
    transform: scaleY(0);
    opacity: 0.001;
}

.fade-shrink-enter-active .inner {
    transition: all 0.3s 0.15s ease-in-out;
}
.fade-shrink-leave-to .inner {
    transition: all 0.2s ease;
}
.fade-shrink-enter-from .inner,
.fade-shrink-leave-to .inner {
    transform: translateY(-10px);
    opacity: 0.001;
}
</style>
