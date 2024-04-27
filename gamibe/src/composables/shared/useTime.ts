import { ref, onMounted, onUnmounted } from 'vue'
import type { TimestampObj } from '@/types/DateTypes'

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

    const isDueToday = (date: Date | TimestampObj) => {
        if (!date) return false
        if ('seconds' in date) date = new Date(date.toDate())
        const start = new Date(today.value)
        const end = new Date(today.value)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        return isDateWithinRange(date, start, end)
    }

    const isDueThisWeek = (date: Date | TimestampObj) => {
        if (!date) return false
        if ('seconds' in date) date = new Date(date.toDate())
        const start = new Date(today.value)
        const end = new Date(today.value)
        end.setDate(end.getDate() + (7 - end.getDay()))
        return isDateWithinRange(date, start, end)
    }

    const isDueNextWeek = (date: Date | TimestampObj) => {
        if (!date) return false
        if ('seconds' in date) date = new Date(date.toDate())
        const start = new Date(today.value)
        const end = new Date(today.value)
        start.setDate(start.getDate() + (7 - start.getDay()))
        end.setDate(end.getDate() + (14 - end.getDay()))
        return isDateWithinRange(date, start, end)
    }

    const isUpcoming = (date: Date | TimestampObj) => {
        if (!date) return false
        if ('seconds' in date) date = new Date(date.toDate())
        const start = new Date(today.value)
        const end = new Date(today.value)
        start.setDate(start.getDate() + (14 - start.getDay()))
        end.setMonth(end.getMonth() + 1)
        return isDateWithinRange(date, start, end)
    }

    const isOverdue = (date: Date | TimestampObj) => {
        if (!date) return false
        if ('seconds' in date) date = new Date(date.toDate())
        const start = new Date(today.value)
        start.setHours(0, 0, 0, 0)
        return date < start
    }

    const getNextDateByFrequency = (
        date: Date | TimestampObj,
        frequency: string
    ): Date | TimestampObj => {
        if (typeof date === 'string') date = new Date(date)
        else if ('seconds' in date) date = new Date(date.toDate())

        switch (frequency) {
            case 'weekly':
                return new Date(date.setDate(date.getDate() + 7))
            case 'bi-weekly':
                return new Date(date.setDate(date.getDate() + 14))
            case 'monthly':
                return new Date(date.setMonth(date.getMonth() + 1))
            case 'bi-monthly':
                return new Date(date.setMonth(date.getMonth() + 2))
            case 'quarterly':
                return new Date(date.setMonth(date.getMonth() + 3))
            case 'bi-quarterly':
                return new Date(date.setMonth(date.getMonth() + 6))
            case 'yearly':
                return new Date(date.setFullYear(date.getFullYear() + 1))
            case 'bi-yearly':
                return new Date(date.setFullYear(date.getFullYear() + 2))
            default:
                return date
        }
    }

    return {
        isDueToday,
        isDueThisWeek,
        isDueNextWeek,
        isUpcoming,
        isOverdue,
        isDateWithinRange,
        getNextDateByFrequency
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

    const getCalendarFrequency = (
        date: Date | any,
        frequency: string,
        deletedDates: any[],
        adjustDay: number = 1
    ) => {
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

        // switch (frequency) {
        //     case 'weekly':
        //         freqObj.repeat.every = 'week'
        //         freqObj.repeat.weekdays = processedDate.getUTCDay() + adjustDay
        //         break
        //     case 'bi-weekly':
        //         freqObj.repeat.every = [2, 'weeks']
        //         freqObj.repeat.weekdays = processedDate.getUTCDay() + adjustDay
        //         break
        //     case 'monthly':
        //         freqObj.repeat.every = 'month'
        //         freqObj.repeat.days = processedDate.getUTCDate()
        //         break
        //     case 'bi-monthly':
        //         freqObj.repeat.every = [2, 'months']
        //         freqObj.repeat.days = processedDate.getUTCDate()
        //         break
        //     case 'quarterly':
        //         freqObj.repeat.every = [3, 'months']
        //         freqObj.repeat.days = processedDate.getUTCDate()
        //         break
        //     case 'bi-quarterly':
        //         freqObj.repeat.every = [6, 'months']
        //         freqObj.repeat.days = processedDate.getUTCDate()
        //         break
        //     case 'yearly':
        //         freqObj.repeat.every = 'year'
        //         freqObj.repeat.on = {
        //             days: processedDate.getUTCDate(),
        //             months: processedDate.getUTCMonth() + 1,
        //             year: processedDate.getUTCFullYear()
        //         }
        //         break
        //     case 'bi-yearly':
        //         freqObj.repeat.every = [2, 'years']
        //         freqObj.repeat.on = {
        //             days: processedDate.getUTCDate(),
        //             months: processedDate.getUTCMonth() + 1,
        //             year: processedDate.getUTCFullYear()
        //         }
        //         break
        //     default:
        //         return [processedDate]
        // }

        switch (frequency) {
            case 'weekly':
                freqObj.repeat.every = 'week'
                freqObj.repeat.on = ({ weekday, date }: { weekday: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = weekday === processedDate.getUTCDate() + adjustDay
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'bi-weekly':
                freqObj.repeat.every = [2, 'weeks']
                freqObj.repeat.on = ({ weekday, date }: { weekday: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = weekday === processedDate.getUTCDate() + adjustDay
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'monthly':
                freqObj.repeat.every = 'month'
                freqObj.repeat.on = ({ day, date }: { day: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = day === processedDate.getUTCDate()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'bi-monthly':
                freqObj.repeat.every = [2, 'months']
                freqObj.repeat.on = ({ day, date }: { day: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = day === processedDate.getUTCDate()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'quarterly':
                freqObj.repeat.every = [3, 'months']
                freqObj.repeat.on = ({ day, date }: { day: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = day === processedDate.getUTCDate()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'bi-quarterly':
                freqObj.repeat.every = [6, 'months']
                freqObj.repeat.on = ({ day, date }: { day: number; date: Date }) => {
                    const dateCal = date.getTime()
                    const isValid = day === processedDate.getUTCDate()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'yearly':
                freqObj.repeat.every = 'year'
                freqObj.repeat.on = ({
                    day,
                    month,
                    year,
                    date
                }: {
                    day: number
                    month: number
                    year: number
                    date: Date
                }) => {
                    const dateCal = date.getTime()
                    const isValid =
                        day === processedDate.getUTCDate() &&
                        month === processedDate.getUTCMonth() + 1 &&
                        year === processedDate.getUTCFullYear()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
                }
                break
            case 'bi-yearly':
                freqObj.repeat.every = [2, 'years']
                freqObj.repeat.on = ({
                    day,
                    month,
                    year,
                    date
                }: {
                    day: number
                    month: number
                    year: number
                    date: Date
                }) => {
                    const dateCal = date.getTime()
                    const isValid =
                        day === processedDate.getUTCDate() &&
                        month === processedDate.getUTCMonth() + 1 &&
                        year === processedDate.getUTCFullYear()
                    if (!deletedDates?.length) return isValid
                    return (
                        isValid &&
                        !deletedDates?.some((arrDate) => {
                            const deletedDate = arrDate.toDate().getTime()
                            return deletedDate === dateCal
                        })
                    )
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
