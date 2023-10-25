<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, query, where, orderBy, limit } from 'firebase/firestore'
const db = useFirestore()
const q = query(
    collection(db, 'test'),
    where('name', '>=', 'odar'),
    where('name', '<=', 'odar~'),
    orderBy('name'),
    limit(10)
)
const test = useCollection(q)
const settings = useDocument(doc(db, 'test', '7Nq3SHYGNUgDmRADQ02Z'))
</script>

<template>
    <header class="flex items-center justify-center pt-10 px-20">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <div class="wrapper">
            <HelloWorld msg="You did it!" />

            <nav class="flex gap-10 pt-5 text-lg text-emerald-400">
                <RouterLink
                    class="active:font-bold active:text-emerald-400 hover:text-emerald-600"
                    to="/"
                    >Home</RouterLink
                >
                <RouterLink class="active:font-bold hover:text-emerald-600" to="/about"
                    >About</RouterLink
                >
            </nav>
        </div>
    </header>

    <h1 class="justify-center items-center flex text-5xl mt-10 flex-col">
        <ul>
            <li v-for="(todo, id) in test" :key="id">
                <span>Nombre: {{ todo.name }} {{ todo.last_name }}</span>
            </li>
        </ul>
        <ul>
            <li>{{ settings }}</li>
        </ul>
    </h1>

    <RouterView class="flex justify-center flex-col px-20 pt-10 pb-20" />
</template>

<style scoped></style>
