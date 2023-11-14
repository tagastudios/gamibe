import { useCollection } from 'vuefire'
import { query, orderBy, limit } from 'firebase/firestore'

import { earningsCollection, savingsCollection, transactionsCollection } from '@/configs/firebase'

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

export const useDatabase = () => {
    return {
        useEarnings,
        useSavings,
        useTransactions
    }
}
