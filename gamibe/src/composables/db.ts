import { useCollection, useCurrentUser } from 'vuefire'
import {
    query,
    where,
    orderBy,
    limit,
    doc,
    addDoc,
    updateDoc,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'

import {
    earningsCollection,
    savingsCollection,
    transactionsCollection,
    billsCollection,
    profilesCollection
} from '@/configs/firebase'

import { computed } from 'vue'

const useEarnings = () => {
    const user = useCurrentUser()

    const earningData = useCollection(() =>
        user.value
            ? // Firebase will error if a null value is passed to `collection()`
              query(
                  earningsCollection,
                  where('user', '==', user.value.uid),
                  orderBy('createdAt', 'desc'),
                  limit(9)
              )
            : // this will be considered as no data source
              null
    )

    return {
        earningData
    }
}

const useSavings = () => {
    const user = useCurrentUser()

    const savingData = useCollection(() =>
        user.value
            ? // Firebase will error if a null value is passed to `collection()`
              query(
                  savingsCollection,
                  where('user', '==', user.value.uid),
                  orderBy('completionPercentage', 'desc'),
                  limit(4)
              )
            : // this will be considered as no data source
              null
    )

    return {
        savingData
    }
}

const useTransactions = () => {
    const user = useCurrentUser()

    const transactionData = useCollection(() =>
        user.value
            ? // Firebase will error if a null value is passed to `collection()`
              query(
                  transactionsCollection,
                  where('user', '==', user.value.uid),
                  orderBy('date_posted', 'desc'),
                  limit(10)
              )
            : // this will be considered as no data source
              null
    )

    return {
        transactionData
    }
}

const useBills = () => {
    const user = useCurrentUser()

    const billData = useCollection(() =>
        user.value
            ? // Firebase will error if a null value is passed to `collection()`
              query(
                  billsCollection,
                  where('user', '==', user.value.uid),
                  orderBy('startAt', 'asc'),
                  limit(10)
              )
            : // this will be considered as no data source
              null
    )

    const addBill = async (bill: any) => {
        const date = new Date(bill.startAt)
        const day = date.getUTCDate()
        const month = date.getUTCMonth()
        const year = date.getUTCFullYear()

        await addDoc(billsCollection, {
            ...bill,
            createdAt: serverTimestamp(),
            startAt: Timestamp.fromDate(new Date(year, month, day)),
            user: user.value?.uid
        })
    }
    const updateBill = (key: string, value: any, id: string) => {
        const billRef = doc(billsCollection, id)
        updateDoc(billRef, {
            [key]: value
        })
    }

    return {
        billData,
        addBill,
        updateBill
    }
}
const useProfile = () => {
    const user = useCurrentUser()

    const profileData = useCollection(() =>
        user.value
            ? // Firebase will error if a null value is passed to `collection()`
              query(profilesCollection, where('user', '==', user.value.uid))
            : // this will be considered as no data source
              null
    )

    const profileId = computed(() => profileData.value[0]?.id)

    console.log('updateProfile', profileId.value)

    const updateProfile = (key: string, value: any) => {
        const profileRef = doc(profilesCollection, profileId.value)
        updateDoc(profileRef, {
            [key]: value
        })
    }

    return {
        profileData,
        updateProfile
    }
}

export const useDatabase = () => {
    return {
        useEarnings,
        useSavings,
        useTransactions,
        useBills,
        useProfile
    }
}
