import type { App } from 'vue'
import { useWebNotification, useTimeAgo } from '@vueuse/core'
import type { UseWebNotificationOptions } from '@vueuse/core'
import { useUser } from '@/composables/useUser'

export default {
    install: (app: App) => {
        // const { bills } = useUser()
        // const upcomingBills = [...bills.thisWeek.data, ...bills.nextWeek.data]
        // const todayBills = bills.today.data
        // const dueBills = bills.overdue.data
        // if (upcomingBills.length > 0) {
        //     upcomingBills.forEach((bill: any) => {
        //         const options: UseWebNotificationOptions = {
        //             title: `Bill Reminder - $${bill.amount}`,
        //             body: `Your ${bill.name} bill is due in ${useTimeAgo(
        //                 bill.nextPayment ?? bill.startAt
        //             )}`,
        //             dir: 'auto',
        //             lang: 'en',
        //             renotify: true,
        //             tag: bill.id,
        //             requireInteraction: true
        //         }
        //         const { isSupported, show } = useWebNotification(options)
        //         if (isSupported.value) show()
        //     })
        // }
        // if (todayBills.length > 0) {
        //     todayBills.forEach((bill: any) => {
        //         const options: UseWebNotificationOptions = {
        //             title: `Bill Reminder - $${bill.amount}`,
        //             body: `Your ${bill.name} bill is due today`,
        //             dir: 'auto',
        //             lang: 'en',
        //             renotify: true,
        //             tag: bill.id,
        //             requireInteraction: true
        //         }
        //         const { isSupported, show } = useWebNotification(options)
        //         if (isSupported.value) show()
        //     })
        // }
        // if (dueBills.length > 0) {
        //     dueBills.forEach((bill: any) => {
        //         const options: UseWebNotificationOptions = {
        //             title: `Bill Reminder - $${bill.amount}`,
        //             body: `Your ${bill.name} bill is overdue by ${useTimeAgo(
        //                 bill.nextPayment ?? bill.startAt
        //             )}`,
        //             dir: 'auto',
        //             lang: 'en',
        //             renotify: true,
        //             tag: bill.id,
        //             requireInteraction: true
        //         }
        //         const { isSupported, show } = useWebNotification(options)
        //         if (isSupported.value) show()
        //     })
        // }
    }
}
