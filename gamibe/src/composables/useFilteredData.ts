import { useUser } from '@/composables/useUser'
import { ref, computed } from 'vue'

export const useFilteredData = () => {
    const { bills, earnings, profile } = useUser()

    const calendarViewData: any = computed(() => {
        const data = new Map()

        const showAll = profile.settings.filterActive === 'all'
        const showIncomeOnly = profile.settings.filterActive === 'income'
        const showExpenseOnly = profile.settings.filterActive === 'expense'

        if (showExpenseOnly || showAll) {
            bills.allBills.data.forEach((bill: any) => data.set('expense-' + bill.id, bill))
        }
        if (showIncomeOnly || showAll) {
            earnings.allEarnings.data.forEach((earning: any) =>
                data.set('income-' + earning.id, earning)
            )
        }

        return [...data].map(([id, data]) => data)
    })

    const listViewData = computed(() => {
        const dataObj: any = {
            today: { total: { add: 0, sub: 0 }, data: [] },
            overdue: { total: { add: 0, sub: 0 }, data: [] },
            thisWeek: { total: { add: 0, sub: 0 }, data: [] },
            nextWeek: { total: { add: 0, sub: 0 }, data: [] },
            upcoming: { total: { add: 0, sub: 0 }, data: [] }
        }

        const showAll = profile.settings.filterActive === 'all'
        const showIncomeOnly = profile.settings.filterActive === 'income'
        const showExpenseOnly = profile.settings.filterActive === 'expense'

        if (showExpenseOnly || showAll) {
            dataObj.today.data = [...dataObj.today.data, ...bills.today.data].sort(sortedList)
            dataObj.today.total.sub = bills.today.total
            dataObj.overdue.data = [...dataObj.overdue.data, ...bills.overdue.data].sort(sortedList)
            dataObj.overdue.total.sub = bills.overdue.total
            dataObj.thisWeek.data = [...dataObj.thisWeek.data, ...bills.thisWeek.data].sort(
                sortedList
            )
            dataObj.thisWeek.total.sub = bills.thisWeek.total
            dataObj.nextWeek.data = [...dataObj.nextWeek.data, ...bills.nextWeek.data].sort(
                sortedList
            )
            dataObj.nextWeek.total.sub = bills.nextWeek.total
            dataObj.upcoming.data = [...dataObj.upcoming.data, ...bills.upcoming.data].sort(
                sortedList
            )
            dataObj.upcoming.total.sub = bills.upcoming.total
        }
        if (showIncomeOnly || showAll) {
            dataObj.today.data = [...dataObj.today.data, ...earnings.today.data].sort(sortedList)
            dataObj.today.total.add = earnings.today.total
            dataObj.overdue.data = [...dataObj.overdue.data, ...earnings.overdue.data].sort(
                sortedList
            )
            dataObj.overdue.total.add = earnings.overdue.total
            dataObj.thisWeek.data = [...dataObj.thisWeek.data, ...earnings.thisWeek.data].sort(
                sortedList
            )
            dataObj.thisWeek.total.add = earnings.thisWeek.total
            dataObj.nextWeek.data = [...dataObj.nextWeek.data, ...earnings.nextWeek.data].sort(
                sortedList
            )
            dataObj.nextWeek.total.add = earnings.nextWeek.total
            dataObj.upcoming.data = [...dataObj.upcoming.data, ...earnings.upcoming.data].sort(
                sortedList
            )
            dataObj.upcoming.total.add = earnings.upcoming.total
        }

        return dataObj
    })

    const calendarRef: any = ref(null)
    const listViewFromCalendar = computed(() => {
        const rangeMode = profile.settings.filterCalendar
        const data: any = []

        const activeMonth = calendarRef.value?.pages[0].month
        const activeWeek = calendarRef.value?.pages[0].viewWeeks[0].weeknumber

        calendarRef.value?.dayCells &&
            Object.values(calendarRef.value?.dayCells).forEach((row: any) => {
                if (rangeMode === 'month' && activeMonth !== row.day.month) return
                else if (rangeMode === 'week' && activeWeek !== row.day.weeknumber) return
                if (row.cells.length) {
                    row.cells.forEach((cell: any) => {
                        const tempData = { ...cell.data.customData }
                        if (!cell.data.customData) return
                        tempData.exactDate = new Date(cell.startDate)
                        tempData.id = Math.random().toString(36).substring(7) // random id
                        tempData.rangeMode = rangeMode
                        data.push(tempData)
                    })
                }
            })

        return sortBy(data, 'exactDate', 'date')
    })

    const refreshListViewFromCalendar = (cal: any) => {
        calendarRef.value = cal
    }

    const sortBy = (arr: any, key: any, type: any) => {
        if (type === 'timestamp')
            return arr.sort((a: any, b: any) => a[key].toDate() - b[key].toDate())
        if (type === 'date')
            return arr.sort(
                (a: any, b: any) =>
                    new Date(a[key]).getMilliseconds() - new Date(b[key]).getMilliseconds()
            )
        // default
        return arr.sort((a: any, b: any) => a[key] - b[key])
    }

    const sortedList = (a: any, b: any) => a.nextPayment.toDate() - b.nextPayment.toDate()

    return {
        calendarViewData,
        listViewData,
        listViewFromCalendar,
        refreshListViewFromCalendar
    }
}
