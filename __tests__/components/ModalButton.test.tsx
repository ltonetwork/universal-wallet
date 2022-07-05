import React from "react"
import ModalButton from "../../src/components/ModalButton"
import { render } from "@testing-library/react-native"
import { navigateToFacebook } from "../../src/utils/redirectSocialMedia"
import { fireEvent } from "@testing-library/react-native"


const mockedDispatch = jest.fn()
mockedDispatch(navigateToFacebook())

it("Should renders correctly", () => {
    const { getByText } = render(<ModalButton text={'Facebook'} onPress={() => navigateToFacebook()} />)

    const ModalButtonText = getByText('Facebook')

    expect(ModalButtonText).toBeTruthy()
})

it('Should open link to facebook when pressed', () => {
    const { getByText } = render(<ModalButton text={'Facebook'} onPress={() => navigateToFacebook()} />)

    const ModalButtonText = getByText('Facebook')
    fireEvent.press(ModalButtonText)

    expect(mockedDispatch).toHaveBeenCalled()
})
