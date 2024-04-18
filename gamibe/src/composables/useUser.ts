import { ref, computed, reactive, onMounted } from 'vue'
import { useDatabase } from '@/composables/db'
import { useWeek } from '@/composables/shared/useTime'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import {
    // auth
    getRedirectResult,
    signInWithRedirect,
    signInWithPopup,
    signOut,
    // providers
    GoogleAuthProvider
} from 'firebase/auth'

type User = {
    displayName?: string
    email?: string
    uid?: string
    photoURL?: string
    [key: string]: any
}

export const useUser = () => {
    const { useProfile, useBills, useEarnings } = useDatabase()

    const { profileData, updateProfile, updateProfileArray, removeProfileArray } = useProfile()
    const { billData, addBill, updateBill, payBill } = useBills()
    const { earningData, addEarning, payEarning } = useEarnings()

    const { isDueToday, isDueThisWeek, isDueNextWeek, isUpcoming, isOverdue } = useWeek()

    const auth = useFirebaseAuth()! // only exists on client side

    ///////////////////////////////////
    ///////////////////////////////////
    // USER // USER // USER // USER ///
    ///////////////////////////////////
    ///////////////////////////////////

    // Providers
    const googleAuthProvider = new GoogleAuthProvider()

    const user: User | null = useCurrentUser()
    const loginError = ref(null)

    const login = (type: string) => {
        switch (type) {
            case 'redirect':
                signinRedirect()
                break
            case 'popup':
                signinPopup()
                break
            default:
                console.error('Invalid login type')
        }
    }

    const signinRedirect = () => {
        signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
            console.error('Failed signinRedirect', reason)
            loginError.value = reason
        })
    }

    const signinPopup = () => {
        loginError.value = null
        signInWithPopup(auth, googleAuthProvider).catch((reason) => {
            console.error('Failed sign', reason)
            loginError.value = reason
        })
    }

    // only on client side
    onMounted(() => {
        getRedirectResult(auth).catch((reason) => {
            console.error('Failed redirect result', reason)
            loginError.value = reason
        })
    })

    const logout = () => signOut(auth)

    ///////////////////////////////////
    ///////////////////////////////////
    // BILLS // BILLS // BILLS // BILLS
    ///////////////////////////////////
    ///////////////////////////////////

    const _bills = reactive({
        data: billData
    })

    const allBills = computed(() => {
        const data = _bills.data
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const todayBills = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueToday(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const thisWeekBills = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueThisWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const nextWeekBills = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueNextWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const upcomingBills = computed(() => {
        // 14 days from today and get first 10
        const data = allBills.value.data
            .filter((bill: any) => isUpcoming(bill.nextPayment ?? bill.startAt))
            .slice(0, 10)
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const overdueBills = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isOverdue(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const bills = reactive({
        allBills,
        today: todayBills,
        thisWeek: thisWeekBills,
        nextWeek: nextWeekBills,
        upcoming: upcomingBills,
        overdue: overdueBills
    })

    ///////////////////////////////////
    ///////////////////////////////////
    // EARNING // EARNING // EARNING //
    ///////////////////////////////////
    ///////////////////////////////////

    const _earnings = reactive({
        data: earningData
    })

    const allEarnings = computed(() => {
        const data = _earnings.data
        const total = data.reduce((acc: number, earning: any) => acc + earning.amount, 0)
        return {
            data,
            total
        }
    })

    const todayEarnings = computed(() => {
        const data = allEarnings.value.data.filter((bill: any) =>
            isDueToday(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const thisWeekEarnings = computed(() => {
        const data = allEarnings.value.data.filter((bill: any) =>
            isDueThisWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const nextWeekEarnings = computed(() => {
        const data = allEarnings.value.data.filter((bill: any) =>
            isDueNextWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const upcomingEarnings = computed(() => {
        // 14 days from today and get first 10
        const data = allEarnings.value.data
            .filter((bill: any) => isUpcoming(bill.nextPayment ?? bill.startAt))
            .slice(0, 10)
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const overdueEarnings = computed(() => {
        const data = allEarnings.value.data.filter((bill: any) =>
            isOverdue(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const earnings = reactive({
        allEarnings,
        today: todayEarnings,
        thisWeek: thisWeekEarnings,
        nextWeek: nextWeekEarnings,
        upcoming: upcomingEarnings,
        overdue: overdueEarnings
    })

    ///////////////////////////////////
    ///////////////////////////////////
    // PROFILE // PROFILE // PROFILE //
    ///////////////////////////////////
    ///////////////////////////////////

    const filterActive = computed({
        get: () => _profile.settings?.settingsFilterActive ?? 'all',
        set: (value) => updateProfile('settingsFilterActive', value)
    })

    const dashboardViewMode = computed({
        get: () => _profile.settings?.settingsDashboardMode ?? 'bills-and-earnings-dashboard',
        set: (value) => updateProfile('settingsDashboardMode', value)
    })

    const showGeneralDashboard = computed(() => dashboardViewMode.value === 'general-dashboard')
    const showBillsAndEarnings = computed(
        () => dashboardViewMode.value === 'bills-and-earnings-dashboard'
    )
    const showBillsOnly = computed(() => dashboardViewMode.value === 'bills-dashboard')

    const billCategories = computed({
        get: () => _profile.settings?.billCategories ?? [],
        set: (value) => updateProfileArray('billCategories', value)
    })
    const billFrequencies = computed({
        get: () => _profile.settings?.billFrequencies ?? [],
        set: (value) => updateProfileArray('billFrequencies', value)
    })
    const earningCategories = computed({
        get: () => _profile.settings?.earningCategories ?? [],
        set: (value) => updateProfileArray('earningCategories', value)
    })
    const earningFrequencies = computed({
        get: () => _profile.settings?.earningFrequencies ?? [],
        set: (value) => updateProfileArray('earningFrequencies', value)
    })

    const removeArrayItem = (key: string, value: any) => {
        removeProfileArray(key, value)
    }

    const _profile: any = reactive({
        settings: profileData
    })

    const settings = reactive({
        filterActive,
        dashboardViewMode,
        showGeneralDashboard,
        showBillsAndEarnings,
        showBillsOnly
    })
    const customLists = reactive({
        billCategories,
        billFrequencies,
        earningCategories,
        earningFrequencies,
        removeArrayItem
    })

    const profile = reactive({
        settings,
        customLists
    })

    return {
        user,
        loginError,
        login,
        logout,
        bills,
        addBill,
        updateBill,
        payBill,
        earnings,
        addEarning,
        payEarning,
        profile
    }
}
