import { useCollection, useCurrentUser, useDocument } from 'vuefire'
import {
    query,
    where,
    orderBy,
    limit,
    doc,
    addDoc,
    updateDoc,
    Timestamp,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore'

import {
    earningsCollection,
    savingsCollection,
    transactionsCollection,
    billsCollection,
    usersCollection
} from '@/configs/firebase'

import { computed } from 'vue'
import type { TimestampObj } from '@/types/DateTypes'
import { useLocalDatabase } from '@/mock/localDb'

const useEarnings = () => {
    const user = useCurrentUser()

    const earningData = useCollection(
        () =>
            user.value
                ? // Firebase will error if a null value is passed to `collection()`
                  query(
                      earningsCollection,
                      where('user', '==', user.value.uid),
                      orderBy('createdAt', 'desc'),
                      limit(9)
                  )
                : // this will be considered as no data source
                  null,
        { ssrKey: 'gamibe' }
    )

    const addEarning = async (earning: any) => {
        const date = new Date(earning.startAt)
        const day = date.getUTCDate()
        const month = date.getUTCMonth()
        const year = date.getUTCFullYear()

        await addDoc(earningsCollection, {
            ...earning,
            createdAt: serverTimestamp(),
            startAt: Timestamp.fromDate(new Date(year, month, day)),
            nextPayment: Timestamp.fromDate(new Date(year, month, day)),
            user: user.value?.uid,
            type: 'earning'
        })
    }

    return {
        earningData,
        addEarning
    }
}

const useSavings = () => {
    const user = useCurrentUser()

    const savingData = useCollection(
        () =>
            user.value
                ? // Firebase will error if a null value is passed to `collection()`
                  query(
                      savingsCollection,
                      where('user', '==', user.value.uid),
                      orderBy('completionPercentage', 'desc'),
                      limit(4)
                  )
                : // this will be considered as no data source
                  null,
        { ssrKey: 'gamibe' }
    )

    return {
        savingData
    }
}

const useTransactions = () => {
    const user = useCurrentUser()

    const transactionData = useCollection(
        () =>
            user.value
                ? // Firebase will error if a null value is passed to `collection()`
                  query(
                      transactionsCollection,
                      where('user', '==', user.value.uid),
                      orderBy('datePosted', 'desc'),
                      limit(10)
                  )
                : // this will be considered as no data source
                  null,
        { ssrKey: 'gamibe' }
    )

    const addTransaction = async (data: any) => {
        await addDoc(transactionsCollection, {
            ...data,
            createdAt: serverTimestamp(),
            user: user.value?.uid,
            type: 'transaction'
        })
    }

    return {
        transactionData,
        addTransaction
    }
}

const useBills = () => {
    const user = useCurrentUser()

    const billData = useCollection(
        () =>
            user.value
                ? // Firebase will error if a null value is passed to `collection()`
                  query(
                      billsCollection,
                      where('user', '==', user.value.uid),
                      orderBy('startAt', 'asc')
                  )
                : // this will be considered as no data source
                  null,
        { ssrKey: 'gamibe' }
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
            nextPayment: Timestamp.fromDate(new Date(year, month, day)),
            user: user.value?.uid,
            type: 'bill'
        })
    }
    const updateBill = (key: string, value: any, billId: string) => {
        const billRef = doc(billsCollection, billId)
        updateDoc(billRef, {
            [key]: key === 'paidBills' ? arrayUnion(value) : value // if key is paidBills, then use add value to current db array
        })
    }
    const payBill = (
        billId: string,
        paymentDate: Date | TimestampObj,
        data: any,
        nextPaymentDate: Date | TimestampObj
    ) => {
        updateBill('paidBills', paymentDate, billId)
        updateBill('nextPayment', nextPaymentDate, billId)

        useTransactions().addTransaction({
            ...data,
            typePaymentDate: paymentDate,
            typeCreatedAt: data.createdAt,
            typeSource: 'bill',
            typeId: billId
        })
    }

    return {
        billData,
        addBill,
        updateBill,
        payBill
    }
}

const useProfile = () => {
    const user = useCurrentUser()

    const profileData = useDocument(() =>
        user.value
            ? // Firebase will error if a null value is passed to `doc()`
              doc(usersCollection, user.value.uid)
            : // this will be considered as no data source
              null
    )

    const profileId = computed(() => user.value?.uid)

    const updateProfile = (key: string, value: any) => {
        const profileRef = doc(usersCollection, profileId.value)
        updateDoc(profileRef, {
            [key]: value
        })
    }

    const updateProfileArray = (key: string, value: any) => {
        const profileRef = doc(usersCollection, profileId.value)
        updateDoc(profileRef, {
            [key]: arrayUnion(value)
        })
    }

    const removeProfileArray = (key: string, value: any) => {
        const profileRef = doc(usersCollection, profileId.value)
        updateDoc(profileRef, {
            [key]: arrayRemove(value)
        })
    }

    return {
        profileData,
        updateProfile,
        updateProfileArray,
        removeProfileArray
    }
}

export const useDatabase = () => {
    // FOR LOCAL DB PURPOSES ONLY
    // MISSING SOLVING THE date.toDate() ERROR in useTime when local
    // tiemstamp from firebase different thann regular obj with millis and seconnds
    // uncomment this line to use local database
    // return useLocalDatabase()
    return {
        useEarnings,
        useSavings,
        useTransactions,
        useBills,
        useProfile
    }
}
