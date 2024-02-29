import { computed, reactive } from 'vue'
import { useDatabase } from '@/composables/db'
import { useWeek } from '@/composables/shared/useTime'

export const useUser = () => {
    const { useProfile, useBills } = useDatabase()

    const { getProfile, updateProfile } = useProfile()
    const { getBills, addBill, updateBill } = useBills()

    const { isDueToday, isDueThisWeek, isDueNextWeek, isUpcoming, isOverdue } = useWeek()

    ///////////////////////////////////
    ///////////////////////////////////
    // BILLS // BILLS // BILLS // BILLS
    ///////////////////////////////////
    ///////////////////////////////////

    const _bills = reactive({
        data: getBills()
    })

    const allBills = computed(() => {
        const data = _bills.data
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const today = computed(() => {
        const data = allBills.value.data.filter((bill: any) => isDueToday(bill.startAt.toDate()))
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const thisWeek = computed(() => {
        const data = allBills.value.data.filter((bill: any) => isDueThisWeek(bill.startAt.toDate()))
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const nextWeek = computed(() => {
        const data = allBills.value.data.filter((bill: any) => isDueNextWeek(bill.startAt.toDate()))
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const upcoming = computed(() => {
        const data = allBills.value.data.filter((bill: any) => isUpcoming(bill.startAt.toDate()))
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const overdue = computed(() => {
        const data = allBills.value.data.filter((bill: any) => isOverdue(bill.startAt.toDate()))
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const bills = reactive({
        allBills,
        today,
        thisWeek,
        nextWeek,
        upcoming,
        overdue
    })

    ///////////////////////////////////
    ///////////////////////////////////
    // PROFILE // PROFILE // PROFILE //
    ///////////////////////////////////
    ///////////////////////////////////

    const dashboardViewMode = computed({
        get: () => _profile.settings?.[0]?.settings_dashboard_mode ?? 'general-dashboard',
        set: (value) => updateProfile('settings_dashboard_mode', value)
    })

    const showGeneralDashboard = computed(() => dashboardViewMode.value === 'general-dashboard')

    const _profile: any = reactive({
        settings: getProfile()
    })

    const settings = reactive({
        dashboardViewMode,
        showGeneralDashboard
    })

    const profile = reactive({
        settings
    })

    return {
        bills,
        addBill,
        updateBill,
        profile
    }
}
