import * as WebBrowser from "expo-web-browser"

export const navigateToWebsite = () => {
    WebBrowser.openBrowserAsync("https://ltonetwork.com")
}

export const navigateToExplorer = () => {
    WebBrowser.openBrowserAsync("https://explorer.testnet.lto.network")
}

export const navigateToWebWallet = () => {
    WebBrowser.openBrowserAsync("https://wallet.testnet.lto.network")
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
