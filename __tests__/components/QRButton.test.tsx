import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import QRButton from "../../src/components/QRButton"

const mockedNavigate = jest.fn()

const mockedProps = {
    onPress: mockedNavigate,
    icon: "qrcode-scan",
    color: "#ffffff",
}

it("Should renders correctly", () => {
    const { getByRole } = render(<QRButton {...mockedProps} />)

    const qRCircle = getByRole("button")

    expect(qRCircle).toBeTruthy()
})

it("Should navigate to QrReader screen", () => {
    const { getByRole } = render(<QRButton {...mockedProps} />)

    const qRCircle = getByRole("button")

    fireEvent.press(qRCircle)

    expect(mockedProps.onPress).toHaveBeenCalled()
})