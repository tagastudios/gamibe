import { ref } from 'vue'
import data from './data.json'

const billDataRaw = data.billDataRaw
const profileDataRaw = data.profileDataRaw
const earningDataRaw = data.earningDataRaw

export const useLocalDatabase = () => {
    const useBills = () => {
        const billData = ref(billDataRaw)
        const addBill = async (bill: any) => {
            console.log('ADDING BILL: ', bill)
            billData.value.push(bill)
        }
        const payBill = async (bill: any) => {
            console.log('PAYING BILL: ', bill)
        }
        const updateBill = async (bill: any) => {
            console.log('UPDATING BILL: ', bill)
        }
        return {
            billData,
            addBill,
            updateBill,
            payBill
        }
    }

    const useProfile = () => {
        const profileData = ref(profileDataRaw)
        const updateProfile = async (profile: any) => {
            console.log('UPDATING PROFILE: ', profile)
        }
        return {
            profileData,
            updateProfile
        }
    }

    const useEarnings = () => {
        const earningData = ref(earningDataRaw)
        const addEarning = async (earning: any) => {
            console.log('ADDING EARNING: ', earning)
        }
        return {
            earningData,
            addEarning
        }
    }

    return {
        useBills,
        useProfile,
        useEarnings
    }
}
