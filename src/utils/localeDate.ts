import * as Localization from 'expo-localization'

export const localeDate = (date: Date|number): string => {
    if (!(date instanceof Date)) date = new Date(date)
    return Intl.DateTimeFormat(Localization.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}
