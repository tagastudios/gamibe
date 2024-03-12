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
        const { mode = '', customPopover = false, highlightToday = false } = options
        const {
            id = null,
            name = '',
            _nickname = '',
            _website = '',
            startAt,
            frequency = '',
            _category,
            amount = 0,
            _paidBills = [],
            _nextPayment
        } = data

        const processedFrequency = getCalendarFrequency(startAt, frequency)
        const calendarExtraObj: any = {}

        if (mode === 'create') {
            const calendarCreateObj: any = {
                key: id ?? Math.random(),
                highlight: processedFrequency ? true : false,
                dates: processedFrequency,
                customData: data
            }
            if (highlightToday) {
                calendarCreateObj.highlight = {
                    color: 'indigo',
                    fillMode: 'light'
                }
                calendarCreateObj.dates = [new Date()]
            }
            return [calendarCreateObj, calendarExtraObj]
        }

        const defaultCalendar = {
            key: id ?? Math.random(),
            dot: getDotColorByDate(startAt.toDate()),
            dates: processedFrequency,
            popover: customPopover || {
                label: 'Bill: ' + name + ' | Amount: $' + amount
            },
            customData: data
        }

        return defaultCalendar
    }

    return { getCalendarAttrs }
}
