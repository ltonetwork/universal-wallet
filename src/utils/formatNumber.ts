export const formatNumber = (number: Number | any): string => {
    const fixedNumber = (number / 100000000).toFixed(3)
    return fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}