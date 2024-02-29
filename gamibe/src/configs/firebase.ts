import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({
    apiKey: 'AIzaSyCd8_uR6T9adiLtHo3SvC2oqayWPmPMWYU',
    authDomain: 'gamibe.firebaseapp.com',
    projectId: 'gamibe',
    storageBucket: 'gamibe.appspot.com',
    messagingSenderId: '882567766019',
    appId: '1:882567766019:web:a4911898c8ab7152146e36',
    measurementId: 'G-H1JC6LENW9'
})

// used for the firestore refs
const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const earningsCollection = collection(db, 'earnings')
export const savingsCollection = collection(db, 'savings')
export const transactionsCollection = collection(db, 'transactions')
export const billsCollection = collection(db, 'bills')
export const summariesCollection = collection(db, 'summaries')
export const profilesCollection = collection(db, 'profiles')
export const usersCollection = collection(db, 'users')
