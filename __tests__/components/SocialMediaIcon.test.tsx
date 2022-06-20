import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import SocialMediaIcon from "../../src/components/SocialMediaIcon"
import { navigateToTwitter } from "../../src/utils/redirectSocialMedia"

const mockedDispatch = jest.fn()
mockedDispatch(navigateToTwitter())

it("Should renders correctly", () => {
    const { getByTestId } = render(<SocialMediaIcon onPress={() => { }} source={require("../../src/assets/images/twitter_logo.png")} />)

    expect(getByTestId("social-media-icon")).toBeTruthy()
})

it("Should redirect to twitter", () => {
    const { getByTestId } = render(<SocialMediaIcon onPress={() => { }} source={require("../../src/assets/images/twitter_logo.png")} />)

    const twitterIcon = getByTestId("social-media-icon")
    fireEvent.press(twitterIcon)

    expect(mockedDispatch).toHaveBeenCalled()
})
