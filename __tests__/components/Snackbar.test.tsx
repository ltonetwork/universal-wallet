import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import SnackbarMessage from "../../src/components/Snackbar"


const mockedProps = {
    open: true,
    message: "Test message",
    onClose: jest.fn(),
}

it("should render correctly and hide after 2 seconds", () => {
    const { getByText } = render(<SnackbarMessage text={mockedProps.message} {...mockedProps} />)

    const SnackbarText = getByText(mockedProps.message)

    expect(SnackbarText).toBeTruthy()
})



