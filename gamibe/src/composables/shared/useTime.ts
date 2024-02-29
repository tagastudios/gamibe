import { ref, onMounted, onUnmounted } from 'vue'

export const useWeek = () => {
    const today = ref(new Date())
    const interval: any = ref(null)

    onMounted(() => {
        // update the date every day
        interval.value = setInterval(
            () => {
                today.value = new Date()
            },
            1000 * 60 * 60 * 24
        )
    })

    onUnmounted(() => {
        // clear the interval when the component is unmounted
        clearInterval(interval.value)
        interval.value = null
    })

    const isDateWithinRange = (date: Date, startDate: Date, endDate: Date) => {
        return date >= startDate && date <= endDate
    }

    const isDueToday = (date: Date) => {
        const start = new Date(today.value)
        const end = new Date(today.value)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        return isDateWithinRange(date, start, end)
    }

    const isDueThisWeek = (date: Date) => {
        const start = new Date(today.value)
        const end = new Date(today.value)
        end.setDate(end.getDate() + (7 - end.getDay()))
        return isDateWithinRange(date, start, end)
    }

    const isDueNextWeek = (date: Date) => {
        const start = new Date(today.value)
        const end = new Date(today.value)
        start.setDate(start.getDate() + (7 - start.getDay()))
        end.setDate(end.getDate() + (14 - end.getDay()))
        return isDateWithinRange(date, start, end)
    }

    const isUpcoming = (date: Date) => {
        const start = new Date(today.value)
        start.setDate(start.getDate() + (14 - start.getDay()))
        return date > start
    }

    const isOverdue = (date: Date) => {
        const start = new Date(today.value)
        start.setHours(0, 0, 0, 0)
        return date < start
    }

    return {
        isDueToday,
        isDueThisWeek,
        isDueNextWeek,
        isUpcoming,
        isOverdue
    }
}

export const useFrequency = () => {
    const options = [
        {
            id: 'once',
            title: 'One Time',
            description: 'Just once'
        },
        {
            id: 'weekly',
            title: 'Weekly',
            description: 'Every week'
        },
        {
            id: 'bi-weekly',
            title: 'Bi-Weekly',
            description: 'Every two weeks'
        },
        {
            id: 'monthly',
            title: 'Monthly',
            description: 'Every month'
        },
        {
            id: 'bi-monthly',
            title: 'Bi-Monthly',
            description: 'Every two months'
        },
        {
            id: 'quarterly',
            title: 'Quarterly',
            description: 'Every three months'
        },
        {
            id: 'bi-quarterly',
            title: 'Bi-Quarterly',
            description: 'Every six months'
        },
        {
            id: 'yearly',
            title: 'Yearly',
            description: 'Every year'
        },
        {
            id: 'bi-yearly',
            title: 'Bi-Yearly',
            description: 'Every two years'
        }
    ]

    const getCalendarFrequency = (date: Date | any, frequency: string, adjustDay: number = 1) => {
        if (!date || !frequency) return null
        if (date.seconds) date = date.toDate()
        const preDate = new Date(date)
        const day = preDate.getUTCDate()
        const month = preDate.getUTCMonth()
        const year = preDate.getUTCFullYear()
        const processedDate = new Date(year, month, day)

        const freqObj: any = {
            start: processedDate,
            label: frequency,
            repeat: {}
        }

        switch (frequency) {
            case 'weekly':
                freqObj.repeat.every = 'week'
                freqObj.repeat.weekdays = processedDate.getUTCDay() + adjustDay
                break
            case 'bi-weekly':
                freqObj.repeat.every = [2, 'weeks']
                freqObj.repeat.weekdays = processedDate.getUTCDay() + adjustDay
                break
            case 'monthly':
                freqObj.repeat.every = 'month'
                freqObj.repeat.days = processedDate.getUTCDate()
                break
            case 'bi-monthly':
                freqObj.repeat.every = [2, 'months']
                freqObj.repeat.days = processedDate.getUTCDate()
                break
            case 'quarterly':
                freqObj.repeat.every = [3, 'months']
                freqObj.repeat.days = processedDate.getUTCDate()
                break
            case 'bi-quarterly':
                freqObj.repeat.every = [6, 'months']
                freqObj.repeat.days = processedDate.getUTCDate()
                break
            case 'yearly':
                freqObj.repeat.every = 'year'
                freqObj.repeat.on = {
                    days: processedDate.getUTCDate(),
                    months: processedDate.getUTCMonth() + 1,
                    year: processedDate.getUTCFullYear()
                }
                break
            case 'bi-yearly':
                freqObj.repeat.every = [2, 'years']
                freqObj.repeat.on = {
                    days: processedDate.getUTCDate(),
                    months: processedDate.getUTCMonth() + 1,
                    year: processedDate.getUTCFullYear()
                }
                break
            default:
                return [processedDate]
        }
        return freqObj
    }

    return {
        options,
        getCalendarFrequency
    }
}
