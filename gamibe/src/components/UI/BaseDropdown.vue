<template>
    <div>
        <div ref="dropdownEl" class="relative flex h-full w-full items-center justify-stretch">
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
                        class="outer absolute right-0 z-40 mt-2 w-full space-y-1 rounded-md border border-indigo-300 bg-indigo-100 p-1 shadow-lg outline outline-1 outline-indigo-300 ring-1 ring-black ring-opacity-5"
                    >
                        <div class="flex h-10 items-center gap-1">
                            <!-- Search input -->
                            <input
                                ref="inputRef"
                                id="search-input"
                                class="inner mt-0.5 block h-full w-full rounded-md border border-indigo-300 bg-transparent px-4 py-2 text-slate-700 shadow-inner placeholder:text-slate-500 focus:outline-none"
                                :class="{
                                    'cursor-not-allowed': showAddNew,
                                    'bg-indigo-200': showAddNew,
                                    'bg-transparent': !showAddNew
                                }"
                                type="text"
                                placeholder="Search.."
                                autocomplete="off"
                                v-model.trim="searchInput"
                                :disabled="showAddNew"
                            />
                            <PlusIcon
                                v-if="controlAdd && !showAddNew"
                                @click="clickAddNew = true"
                                class="inner aspect-square h-full cursor-pointer rounded-md bg-indigo-300 p-2 text-3xl font-black text-white shadow-sm shadow-indigo-500 active:text-blue-700 active:shadow-inner active:shadow-blue-700"
                            />
                            <ArrowLeftIcon
                                v-else-if="controlAdd && showAddNew"
                                @click="clickAddNew = false"
                                class="inner aspect-square h-full cursor-pointer rounded-md bg-indigo-300 p-2 text-3xl font-black text-white shadow-sm shadow-indigo-500 active:text-blue-700 active:shadow-inner active:shadow-blue-700"
                            />
                        </div>
                        <!-- Dropdown content goes here -->
                        <Transition :duration="300" mode="out-in" name="fade-slide" appear>
                            <div
                                v-if="showDropdownList"
                                :class="`inner z-30 grid grid-cols-${columns} gap-4 rounded-md  px-2 pb-4 pt-2 text-slate-600 shadow-lg`"
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
                                    @click.stop="selectOption(option)"
                                >
                                    <div
                                        v-if="option.custom && showRemoveConfirmation"
                                        class="flex items-center"
                                    >
                                        <div class="flex items-center">
                                            <p class="font-semibold">
                                                Are you sure? There's no way back after this!
                                            </p>
                                            <button
                                                @click.stop="controlRemoveFn(option)"
                                                class="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-red-500 px-8 py-4 text-white hover:bg-red-600 focus:outline-none active:bg-red-800"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                @click.stop="showRemoveConfirmation = false"
                                                class="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 px-8 py-4 text-white hover:bg-blue-600 focus:outline-none active:bg-blue-800"
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else class="flex h-full w-full items-center">
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
                                                :is="option.icon || QuestionMarkCircleIcon"
                                                class="aspect-square h-full"
                                            />
                                        </div>
                                        <div class="ml-3 w-full">
                                            <p class="line-clamp-1 font-semibold">
                                                {{ option.title }}
                                            </p>
                                            <p class="line-clamp-1 text-sm">
                                                {{ option.description }}
                                            </p>
                                            <p v-if="columns > 1" class="line-clamp-1 text-sm">
                                                {{ option.extra }}
                                            </p>
                                        </div>
                                        <div
                                            v-if="option.extra && columns == 1"
                                            class="ml-6 text-right"
                                        >
                                            <p class="font-semibold">{{ option.extra }}</p>
                                        </div>
                                        <TrashIcon
                                            v-if="controlRemove && option.custom"
                                            @click.stop="showRemoveConfirmation = true"
                                            class="-mt-1 ml-2 h-6 w-6 cursor-pointer items-center text-red-500 hover:text-red-700 focus:outline-none active:text-red-800"
                                        />
                                    </div>
                                </a>
                            </div>
                            <form @submit="controlAddFn" v-else-if="showAddNew" class="pt-4">
                                <div class="text-blue-800">Add new option:</div>
                                <input
                                    ref="newOptionTitleRef"
                                    class="inner mt-0.5 block h-full w-full rounded-md border border-indigo-300 bg-transparent px-4 py-2 text-slate-700 shadow-inner placeholder:text-slate-500 focus:outline-none"
                                    type="text"
                                    placeholder="Title"
                                    autocomplete="off"
                                    v-model.trim="newOption.title"
                                    required
                                />
                                <input
                                    class="inner mt-0.5 block h-full w-full rounded-md border border-indigo-300 bg-transparent px-4 py-2 text-slate-700 shadow-inner placeholder:text-slate-500 focus:outline-none"
                                    type="text"
                                    placeholder="Description (Optional)"
                                    autocomplete="off"
                                    v-model.trim="newOption.description"
                                />
                                <input
                                    class="inner mt-0.5 block h-full w-full rounded-md border border-indigo-300 bg-transparent px-4 py-2 text-slate-700 shadow-inner placeholder:text-slate-500 focus:outline-none"
                                    type="url"
                                    placeholder="Image Link (Optional)"
                                    autocomplete="off"
                                    v-model.trim="newOption.image"
                                />
                                <button
                                    type="submit"
                                    class="mt-4 h-10 w-full rounded-md bg-blue-700 text-white hover:bg-blue-600 focus:outline-none active:bg-blue-800"
                                >
                                    Add New
                                </button>
                            </form>
                            <div v-else class="py-[34px] text-center text-sm text-slate-700">
                                Sorry, didn't found any option with that parameter!
                            </div>
                        </Transition>
                    </div>
                </Transition>
            </div>
        </div>
        <div
            v-if="dropdownMenuIsOpen"
            class="absolute left-0 top-0 z-0 h-full w-full bg-slate-900 opacity-75 backdrop-blur"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
    BanknotesIcon,
    QuestionMarkCircleIcon,
    PlusIcon,
    ArrowLeftIcon,
    TrashIcon
} from '@heroicons/vue/24/solid'

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

const emits = defineEmits(['control-add', 'control-remove', 'update:modelValue'])

const props = defineProps({
    columns: {
        type: Number,
        default: 1
    },
    placeholder: {
        type: String,
        default: 'Open Dropdown'
    },
    controlAdd: {
        type: Boolean,
        default: false
    },
    controlRemove: {
        type: Boolean,
        default: false
    }
})

const selectedOption: any = ref(null)

onMounted(() => {
    if (modelValue.value.id) selectedOption.value = modelValue.value
})

const selectOption = (option: any) => {
    if (showRemoveConfirmation.value) return
    dropdownMenuIsOpen.value = false
    selectedOption.value = option
    modelValue.value = option
}

const searchInput: any = ref('')
const inputRef: any = ref(null)
const dropdownMenuIsOpen = ref(false)
const clickAddNew = ref(false)
const timerAlt: any = ref(null)
const showRemoveConfirmation = ref(false)

watchEffect(() => {
    if (dropdownMenuIsOpen.value) {
        inputRef.value?.focus()
        clickAddNew.value = false
    } else {
        searchInput.value = ''
        showRemoveConfirmation.value = false
        clearTimeout(timerAlt.value)
    }
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

const showDropdownList = computed(() => !clickAddNew.value && filteredOptions.value?.length > 0)
const showAddNew = computed(() => props.controlAdd && clickAddNew.value)

const newOptionTitleRef: any = ref(null)
const newOption = ref({
    title: '',
    description: '',
    image: ''
})

const controlAddFn = (e: any) => {
    e.preventDefault()
    // Add new option
    const fullOption = {
        ...newOption.value,
        extra: '',
        icon: '',
        custom: true,
        id: newOption.value.title.toLocaleLowerCase().replace(/\s/g, '-')
    }
    selectOption(fullOption)
    emits('control-add', fullOption) //add id that is title with spaces replaced by '-'
    // Reset values
    newOption.value = { title: '', description: '', image: '' }
}
const controlRemoveFn = (option: any) => {
    emits('control-remove', option)
    if (selectedOption.value.id == option.id) {
        selectedOption.value = null
        modelValue.value = {}
    }
    showRemoveConfirmation.value = false
}

watch(
    () => showAddNew.value,
    (value) => {
        timerAlt.value = setTimeout(() => {
            if (value) newOptionTitleRef.value?.focus()
            else inputRef.value?.focus()
        }, 500)
    }
)
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
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}
</style>
