type formatCurrencyOptions = {
    format?: string
    style?: string
    currency?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    default?: string
}

export const useCurrency = () => {
    const defaultOptions = {
        format: 'en-US',
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        default: '$0'
    }

    const formatCurrency = (value: number, options: formatCurrencyOptions = defaultOptions) => {
        const currentOptions = { ...defaultOptions, ...options }
        if (!value) return currentOptions.default
        else if (typeof value == 'number') {
            const currency = new Intl.NumberFormat(currentOptions.format, {
                style: currentOptions.style,
                currency: currentOptions.currency,
                minimumFractionDigits: currentOptions.minimumFractionDigits,
                maximumFractionDigits: currentOptions.maximumFractionDigits
            }).format(value)
            return currency
        }
    }

    return {
        formatCurrency
    }
}
