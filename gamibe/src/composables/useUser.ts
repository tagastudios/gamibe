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
    const { useProfile, useBills } = useDatabase()

    const { profileData, updateProfile } = useProfile()
    const { billData, addBill, updateBill, payBill } = useBills()

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

    const today = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueToday(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const thisWeek = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueThisWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const nextWeek = computed(() => {
        const data = allBills.value.data.filter((bill: any) =>
            isDueNextWeek(bill.nextPayment ?? bill.startAt)
        )
        const total = data.reduce((acc: number, bill: any) => acc + bill.amount, 0)
        return {
            data,
            total
        }
    })

    const upcoming = computed(() => {
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

    const overdue = computed(() => {
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
        get: () => _profile.settings?.settingsDashboardMode ?? 'general-dashboard',
        set: (value) => updateProfile('settingsDashboardMode', value)
    })

    const showGeneralDashboard = computed(() => dashboardViewMode.value === 'general-dashboard')

    const _profile: any = reactive({
        settings: profileData
    })

    const settings = reactive({
        dashboardViewMode,
        showGeneralDashboard
    })

    const profile = reactive({
        settings
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
        profile
    }
}
