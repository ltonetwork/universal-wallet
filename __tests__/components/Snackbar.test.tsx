import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { MessageContext } from "../../src/context/UserMessage.context"
import { MessageProviderWrapper } from "../../src/context/UserMessage.context"
import SnackbarMessage from "../../src/components/Snackbar"

jest.useFakeTimers()

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')


it("Should renders correctly", () => {
    const { getByRole, getByText } = render(
        <MessageProviderWrapper>
            <SnackbarMessage />
        </MessageProviderWrapper>
    )

    const iconButton = getByRole("button")
    const input = getByText("")

    expect(iconButton).toBeTruthy()
    expect(input).toBeTruthy()
})




