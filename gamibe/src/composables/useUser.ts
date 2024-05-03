import { ref, computed, reactive, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import {
    // auth
    getRedirectResult,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    // providers
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider
} from 'firebase/auth'
import { useDatabase } from '@/composables/db'
import { useWeek } from '@/composables/shared/useTime'

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
    const { billData, addBill, updateBill, payBill, deleteBill, deleteBillDate } = useBills()
    const { earningData, addEarning, payEarning, deleteEarning, deleteEarningDate } = useEarnings()

    const { isDueToday, isDueThisWeek, isDueNextWeek, isUpcoming, isOverdue } = useWeek()

    const auth = useFirebaseAuth()! // only exists on client side

    ///////////////////////////////////
    ///////////////////////////////////
    // USER // USER // USER // USER ///
    ///////////////////////////////////
    ///////////////////////////////////

    // Providers
    const googleAuthProvider = new GoogleAuthProvider()
    const facebookAuthProvider = new FacebookAuthProvider()
    const appleAuthProvider = new OAuthProvider('apple.com')

    const user: User | null = useCurrentUser()
    const loginError: Ref<string | null> = ref(null)

    const login = (type: string, email?: string, password?: string) => {
        switch (type) {
            case 'email':
                if (email && password) signinWithEmail(email, password)
                break
            case 'google':
                signinWithGoogle()
                break
            case 'facebook':
                signinWithFacebook()
                break
            case 'apple':
                signinWithApple()
                break
            default:
                console.error('Invalid login type')
        }
    }

    const signinWithGoogle = () => {
        loginError.value = null
        signInWithPopup(auth, googleAuthProvider).catch((reason) => {
            loginError.value = processErrorString(reason)
        })
    }

    const signinWithFacebook = () => {
        loginError.value = null
        signInWithPopup(auth, facebookAuthProvider).catch((reason) => {
            loginError.value = processErrorString(reason)
        })
    }

    const signinWithApple = () => {
        loginError.value = null
        signInWithPopup(auth, appleAuthProvider).catch((reason) => {
            loginError.value = processErrorString(reason)
        })
    }

    const signinWithEmail = async (email: string, password: string) => {
        loginError.value = null
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user
                console.log('User logged', user)
            })
            .catch((reason) => {
                loginError.value = processErrorString(reason)
            })
    }

    const register = async (email: string, password: string) => {
        loginError.value = null
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user
                console.log('User created', user)
            })
            .catch((reason) => {
                loginError.value = processErrorString(reason)
            })
    }

    const processErrorString = (reason: any) => {
        const paranthesis = reason.message.match(/\(([^)]+)\)/)?.[1] // get the first paranthesis content
        const source = paranthesis?.split('/')[0] // get the first part of the string
        const formattedSource = source?.charAt(0).toUpperCase() + source?.slice(1) // capitalize the first letter
        const error = paranthesis?.split('/')[1]?.replace(/-/g, ' ').replace(/_/g, ' ') // get the second part of the string and replace - and _ with space
        const formattedError = error?.charAt(0).toUpperCase() + error?.slice(1) // capitalize the first letter
        return `(${formattedSource}) ${formattedError}`
    }

    // only on client side
    onMounted(() => {
        getRedirectResult(auth).catch((reason) => {
            console.error('Failed redirect result', reason)
            loginError.value = processErrorString(reason)
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

    const filterCalendar = computed({
        get: () => _profile.settings?.settingsFilterCalendar ?? 'month',
        set: (value) => updateProfile('settingsFilterCalendar', value)
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
        filterCalendar,
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
        register,
        logout,
        bills,
        addBill,
        updateBill,
        payBill,
        deleteBill,
        deleteBillDate,
        earnings,
        addEarning,
        payEarning,
        deleteEarning,
        deleteEarningDate,
        profile
    }
}
