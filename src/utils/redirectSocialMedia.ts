import * as WebBrowser from "expo-web-browser"

export const navigateToTwitter = () => {
    WebBrowser.openBrowserAsync("https://www.twitter.com")
}

export const navigateToFacebook = () => {
    WebBrowser.openBrowserAsync("https://www.facebook.com")
}

export const navigateToTelegram = () => {
    WebBrowser.openBrowserAsync("https://www.telegram.com")
}

export const navigateToLinkedin = () => {
    WebBrowser.openBrowserAsync("https://www.linkedin.com")
}
