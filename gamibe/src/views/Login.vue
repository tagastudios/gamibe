<template>
    <main>
        <h1 class="sr-only m-auto text-5xl font-black">SignIn / SignUp</h1>
        <div class="flex h-screen w-full flex-col items-center justify-between">
            <div
                class="grid w-full items-center justify-center transition-all delay-300 duration-500"
                :class="`${isSignIn ? 'h-1/2' : isSignUp ? 'h-2/6' : 'h-3/5'}`"
            >
                <div v-if="isSignIn" class="flex flex-col gap-4">
                    <p class="text-[60px] font-black">Hi</p>
                    <p class="text-xl font-light text-white">Welcome back!</p>
                </div>
                <div v-else-if="isSignUp" class="flex flex-col gap-4">
                    <p class="text-[60px] font-black">Hello</p>
                    <p class="text-xl font-light text-white">Let's get started!</p>
                </div>
            </div>
            <div
                class="relative flex w-full flex-col items-center justify-between rounded-t-[40px] bg-slate-950 p-8 transition-all delay-300 duration-500"
                :class="`${isSignIn ? 'h-1/2' : isSignUp ? 'h-4/6' : 'h-2/5'}`"
            >
                <div
                    class="w-full items-center justify-between pb-4 text-2xl font-bold text-white"
                    :class="`${openBgLayer ? 'animate-title-open' : 'animate-title-close'}`"
                >
                    <v-icon @click="resetLogin" name="hi-chevron-left" class="w-5 cursor-pointer" />
                    <p class="w-full text-center">
                        {{ isSignIn ? 'Sign In' : 'Sign Up' }}
                    </p>
                    <div class="w-5" />
                </div>

                <Transition name="fade" mode="out-in">
                    <div
                        v-if="isSignIn"
                        class="flex w-full flex-col items-center gap-4 overflow-auto"
                        :class="`${isSignIn ? 'opacity-100' : 'opacity-0'}`"
                    >
                        <BaseInput placeholder="Email" />
                        <BaseInput placeholder="Password" />
                        <BaseButton big @click="login('popup')" color="blue-gradient-1">
                            <div
                                class="flex h-full w-full items-center justify-center text-base font-bold"
                            >
                                Sign In
                            </div>
                        </BaseButton>
                    </div>
                    <div
                        v-else-if="isSignUp"
                        class="flex w-full flex-col items-center gap-4 overflow-auto"
                        :class="`${isSignUp ? 'opacity-100' : 'opacity-0'}`"
                    >
                        <BaseInput placeholder="Email" />
                        <BaseInput placeholder="Username" />
                        <BaseInput placeholder="Password" />
                        <BaseInput placeholder="Confirm Password" />
                        <BaseButton big @click="login('popup')" color="blue-gradient-1">
                            <div
                                class="flex h-full w-full items-center justify-center text-base font-bold"
                            >
                                Create an account
                            </div>
                        </BaseButton>
                        <p class="text-[12px]">
                            We don't spam, we'll take care of your
                            <a
                                href="#"
                                class="text-blue-500 underline decoration-blue-500 decoration-wavy underline-offset-4 shadow-lg shadow-blue-800"
                                >privacy</a
                            >
                        </p>
                    </div>
                    <div
                        v-else
                        class="flex w-full flex-col items-center gap-4 overflow-auto px-1"
                        :class="`${openBgLayer ? 'opacity-0' : 'opacity-100'}`"
                    >
                        <BaseButton big @click="isSignUp = true">
                            <div class="flex h-full w-full items-center justify-center text-base">
                                Create an account
                            </div>
                        </BaseButton>
                        <BaseButton big @click="isSignIn = true" color="blue-gradient-1">
                            <div
                                class="flex h-full w-full items-center justify-center text-base font-bold"
                            >
                                Sign In
                            </div>
                        </BaseButton>
                    </div>
                </Transition>

                <div class="flex min-h-24 w-full flex-col items-center justify-center gap-6">
                    <div class="relative flex w-full flex-1 items-center justify-center">
                        <p class="z-10 bg-slate-950 px-2 font-semibold text-zinc-300">
                            Or {{ isSignUp ? 'sign up' : 'sign in' }} with
                        </p>
                        <hr
                            class="absolute left-1/2 top-1/2 z-0 w-4/5 -translate-x-1/2 bg-slate-500"
                        />
                        <!-- <div v-if="loginError">{{ loginError }}</div> -->
                    </div>
                    <div class="flex h-12 w-full items-center justify-center gap-4">
                        <BaseButton circle @click="login('google')" color="white">
                            <div class="flex h-full w-full items-center justify-center">
                                <v-icon name="bi-google" scale="1.5" color="#181818" />
                            </div>
                        </BaseButton>
                        <BaseButton circle @click="login('facebook')" color="white">
                            <div class="flex h-full w-full items-center justify-center">
                                <v-icon name="fa-facebook-f" scale="1.5" color="#181818" />
                            </div>
                        </BaseButton>
                        <BaseButton circle @click="login('apple')" color="white">
                            <div class="flex h-full w-full items-center justify-center">
                                <v-icon name="bi-apple" scale="1.5" color="#181818" />
                            </div>
                        </BaseButton>
                        <BaseButton circle @click="login('discord')" color="white" disabled>
                            <div class="flex h-full w-full items-center justify-center">
                                <v-icon name="bi-discord" scale="1.5" color="#181818" />
                            </div>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/UI/BaseButton.vue'
import BaseInput from '@/components/UI/BaseInput.vue'
import { useUser } from '@/composables/useUser'

const { login, loginError } = useUser()

const isSignIn = ref(false)
const isSignUp = ref(false)
const resetLogin = () => {
    isSignIn.value = false
    isSignUp.value = false
}

const openBgLayer = computed(() => {
    return isSignIn.value || isSignUp.value
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s 0.25s;
    transition-timing-function: ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.animate-title-open {
    animation: title-open 1s ease-in-out forwards;
}

@keyframes title-open {
    0% {
        max-height: 0px !important;
        height: 0px !important;
        opacity: 0;
        display: none;
    }
    49% {
        max-height: 0px !important;
        height: 0px !important;
        opacity: 0;
        display: none;
    }
    50% {
        max-height: 0px !important;
        height: 0px !important;
        opacity: 0;
        display: flex;
    }
    100% {
        height: 48px !important;
        max-height: 48px !important;
        opacity: 1;
        display: flex;
    }
}

.animate-title-close {
    animation: title-close 0.5s ease-in-out forwards;
}

@keyframes title-close {
    0% {
        height: 48px !important;
        max-height: 48px !important;
        opacity: 1;
        display: flex;
    }
    49% {
        height: 48px !important;
        max-height: 48px !important;
        opacity: 1;
        display: flex;
    }
    50% {
        height: 48px !important;
        max-height: 48px !important;
        opacity: 1;
        display: none;
    }
    100% {
        max-height: 0px !important;
        height: 0px !important;
        opacity: 0;
        display: none;
    }
}
</style>
