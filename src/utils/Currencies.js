export const CURRENCY_EUR = "EUR";
export const CURRENCY_USD = "USD";
export const CURRENCY_GBP = "GBP";

export const allSupportedCurrencies = ["EUR", "USD", "GBP"]

export function getCurrencySymbol (currencyCode) {
    switch (currencyCode) {
        case 'EUR':
            return '€'
        case 'USD':
            return '$'
        case 'GBP':
            return '£'
        default:
            return '€'
    }
}