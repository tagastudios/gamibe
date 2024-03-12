import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDateFormat } from '@vueuse/core'

export const useBillStore = defineStore('bill', () => {
    const name = ref('')
    const nickname = ref('')
    const website = ref('')
    const startAt = ref('')
    const frequency = ref({ id: '' })
    const category = ref({ id: '' })
    const amount = ref(0)

    const bill = reactive({
        name,
        nickname,
        website,
        startAt,
        frequency,
        category,
        amount
    })

    const resetBill = () => {
        bill.name = ''
        bill.nickname = ''
        bill.website = ''
        bill.startAt = ''
        bill.frequency = {
            id: ''
        }
        bill.category = {
            id: ''
        }
        bill.amount = 0
    }

    const billFrequencyId = computed(() => frequency.value?.id)
    const billCategoryId = computed(() => category.value?.id)
    const billStartAt = computed(
        () => startAt.value && useDateFormat(startAt.value, 'YYYY-MM-DD').value
    )

    const billForDb = reactive({
        name,
        nickname,
        website,
        startAt: billStartAt,
        frequency: billFrequencyId,
        category: billCategoryId,
        amount
    })

    return { bill, billForDb, resetBill }
})

export const useIncomeStore = defineStore('income', () => {
    const income = reactive({
        name: '',
        startAt: new Date(),
        account: {},
        amount: 0
    })

    const resetIncome = () => {
        income.name = ''
        income.startAt = new Date()
        income.account = {}
        income.amount = 0
    }

    return { income, resetIncome }
})
