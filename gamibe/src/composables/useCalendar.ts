import { useFrequency, useWeek } from '@/composables/shared/useTime'

type CalendarAttrs = {
    key: number
    highlight?: boolean
    dot?: boolean | 'red' | 'orange' | 'yellow' | 'green'
    dates: Date[]
}

export const useCalendar = () => {
    const { getCalendarFrequency } = useFrequency()

    const getDotColorByType = (type: string) => {
        if (type === 'bill') return 'red'
        if (type === 'earning') return 'green'
        if (type === 'saving') return 'purple'
        if (type === 'transaction') return 'gray'
        return true
    }

    const getCalendarAttrs = (data: any, options: any) => {
        const { mode = '', customPopover = false, highlightToday = false, type = '' } = options
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
            dot: getDotColorByType(type),
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
