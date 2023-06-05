import * as WebBrowser from "expo-web-browser"

const EXPLORER_URL = process.env.LTO_EXPLORER_URL || 'https://explorer.testnet.lto.network'
const WALLET_URL = process.env.LTO_WALLET_URL || 'https://wallet.testnet.lto.network'

export const nagivateTo = (url: string) => {
    WebBrowser.openBrowserAsync(url)
}

export const navigateToWebsite = () => {
    WebBrowser.openBrowserAsync("https://ltonetwork.com")
}

export const navigateToExplorer = () => {
    WebBrowser.openBrowserAsync(EXPLORER_URL)
}

export const navigateToTransaction = (id: string) => {
    WebBrowser.openBrowserAsync(`${EXPLORER_URL}/transactions/${id}`)
}

export const navigateToWebWallet = () => {
    WebBrowser.openBrowserAsync(WALLET_URL)
}

export const navigateToTwitter = () => {
    WebBrowser.openBrowserAsync("https://twitter.com/TheLTONetwork")
}

export const navigateToFacebook = () => {
    WebBrowser.openBrowserAsync("https://facebook.com/TheLTONetwork/")
}

export const navigateToTelegram = () => {
    WebBrowser.openBrowserAsync("https://t.me/ltonetwork")
}

export const navigateToLinkedin = () => {
    WebBrowser.openBrowserAsync("https://linkedin.com/company/ltonetwork/")
}

export const navigateToGithub = () => {
    WebBrowser.openBrowserAsync("https://github.com/ltonetwork/")
}
