import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import TermsModal from "../../src/components/TermsModal"

const mockedState = {
    checked: false,
    setChecked: jest.fn(),
    modalVisible: true,
    setModalVisible: jest.fn(),
}

it('Should shows the children and a close button', () => {
    const { getByRole, getByText } = render(<TermsModal
        visible={true}
        onClose={mockedState.setModalVisible(false)}
        onRequestClose={mockedState.setModalVisible(false)}
        setChecked={mockedState.setChecked}
    />)

    const ModalText = getByText('TERMS AND CONDITIONS')
    const CloseButton = getByRole('button')

    expect(ModalText).toBeTruthy()
    expect(CloseButton).toBeTruthy()
})



