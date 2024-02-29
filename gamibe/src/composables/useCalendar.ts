import { useFrequency, useWeek } from '@/composables/shared/useTime'

type CalendarAttrs = {
    key: number
    highlight?: boolean
    dot?: boolean | 'red' | 'orange' | 'yellow' | 'green'
    dates: Date[]
}

export const useCalendar = () => {
    const { getCalendarFrequency } = useFrequency()
    const { isDueToday, isDueThisWeek, isDueNextWeek, isUpcoming, isOverdue } = useWeek()

    const getDotColorByDate = (date: Date) => {
        if (isDueToday(date)) {
            return 'red'
        } else if (isDueThisWeek(date)) {
            return 'orange'
        } else if (isDueNextWeek(date)) {
            return 'yellow'
        } else if (isUpcoming(date)) {
            return 'green'
        } else if (isOverdue(date)) {
            return 'red'
        }
    }

    const getCalendarAttrs = (data: any, options: any) => {
        const { mode = '', customPopover = false } = options
        const {
            id = null,
            name = '',
            nickname = '',
            website = '',
            startAt,
            frequency = '',
            category,
            amount = 0,
            paidAt
        } = data

        const processedFrequency = getCalendarFrequency(startAt, frequency)

        if (mode === 'create') {
            return [
                {
                    key: id ?? Math.random(),
                    highlight: processedFrequency ? true : false,
                    dates: processedFrequency,
                    customData: data
                }
            ]
        }

        const defaultCalendar = {
            key: id ?? Math.random(),
            dot: getDotColorByDate(startAt.toDate()),
            dates: processedFrequency,
            popover: customPopover
                ? customPopover
                : {
                      label: 'Bill: ' + name + ' | Amount: $' + amount
                  },
            customData: data
        }

        return defaultCalendar
    }

    return { getCalendarAttrs }
}
