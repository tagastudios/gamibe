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

export const useEarningStore = defineStore('earning', () => {
    const name = ref('')
    const nickname = ref('')
    const website = ref('')
    const startAt = ref(new Date())
    const frequency = ref({ id: '' })
    const category = ref({ id: '' })
    const account = ref({ id: '' })
    const amount = ref(0)

    const earning = reactive({
        name,
        nickname,
        website,
        startAt,
        frequency,
        category,
        account,
        amount
    })

    const resetEarning = () => {
        earning.name = ''
        earning.nickname = ''
        earning.website = ''
        earning.startAt = new Date()
        earning.frequency = { id: '' }
        earning.category = { id: '' }
        earning.account = { id: '' }
        earning.amount = 0
    }

    const earningFrequencyId = computed(() => frequency.value?.id)
    const earningCategoryId = computed(() => category.value?.id)
    const earningStartAt = computed(
        () => startAt.value && useDateFormat(startAt.value, 'YYYY-MM-DD').value
    )
    const earningAccount = computed(() => account.value?.id)
    const earningForDb = reactive({
        name,
        nickname,
        website,
        startAt: earningStartAt,
        frequency: earningFrequencyId,
        category: earningCategoryId,
        account: earningAccount,
        amount
    })

    return { earning, earningForDb, resetEarning }
})
