import { LTO_REPRESENTATION } from "../constants/Quantities"

export const formatNumber = (number: Number | any): string => {
    if (isNaN(number / LTO_REPRESENTATION)) return ''

    const fixedNumber = (number / LTO_REPRESENTATION).toFixed(2)
    return fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
