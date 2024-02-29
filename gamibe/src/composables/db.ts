import { useCollection } from 'vuefire'
import {
    query,
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

const useEarnings = (sortBy?: string) => {
    const earningQuery = query(earningsCollection, orderBy('createdAt', 'desc'), limit(9))

    return {
        data: useCollection(earningQuery)
    }
}

const useSavings = (id?: string) => {
    const savingQuery = query(savingsCollection, orderBy('completion_percentage', 'desc'), limit(4))

    return {
        data: useCollection(savingQuery)
    }
}

const useTransactions = (id?: string) => {
    const transactionQuery = query(
        transactionsCollection,
        orderBy('date_posted', 'desc'),
        limit(10)
    )

    return {
        data: useCollection(transactionQuery)
    }
}

const useBills = (id?: string) => {
    const getBills = () => {
        const billQuery = query(billsCollection, orderBy('startAt', 'asc'), limit(10))
        return useCollection(billQuery)
    }
    const addBill = async (bill: any) => {
        const date = new Date(bill.startAt)
        const day = date.getUTCDate()
        const month = date.getUTCMonth()
        const year = date.getUTCFullYear()

        await addDoc(billsCollection, {
            ...bill,
            createdAt: serverTimestamp(),
            startAt: Timestamp.fromDate(new Date(year, month, day))
        })
    }
    const updateBill = (key: string, value: any, id: string) => {
        const billRef = doc(billsCollection, id)
        updateDoc(billRef, {
            [key]: value
        })
    }

    return {
        getBills,
        addBill,
        updateBill
    }
}

const useProfile = (id?: string) => {
    const getProfile = () => {
        const profileQuery = query(profilesCollection)
        return useCollection(profileQuery)
    }

    const updateProfile = (key: string, value: any) => {
        const profileRef = doc(profilesCollection, 'lZSyDeyBLOl66NoC17Mc')
        updateDoc(profileRef, {
            [key]: value
        })
    }

    return {
        getProfile,
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
