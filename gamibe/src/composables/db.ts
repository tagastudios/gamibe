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
    arrayUnion
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

    return {
        earningData
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
            user: user.value?.uid
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
            user: user.value?.uid
        })
    }
    const updateBill = (key: string, value: any, billId: string) => {
        const billRef = doc(billsCollection, billId)
        updateDoc(billRef, {
            [key]: key === 'paidBills' ? arrayUnion(value) : value // if key is paidBills, then use add value to curr=nt db array
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
            type: 'bill',
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
