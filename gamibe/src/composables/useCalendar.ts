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
        let backgroundColor = 'black'
        if (type === 'bill') backgroundColor = '#FF6347' // Tomato > warning
        if (type === 'earning') backgroundColor = '#00FF00' // Lime > growth and prosperity
        if (type === 'saving') backgroundColor = '#1E90FF ' // Dodger Blue > optimism and relaiability
        if (type === 'transaction') backgroundColor = '#FFD700' // Gold > signifies value
        return {
            style: {
                backgroundColor
            }
        }
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
