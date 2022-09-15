import { render } from "@testing-library/react-native"
import React from "react"
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

    const modalText = getByText('TERMS AND CONDITIONS')
    const closeButton = getByRole('button')

    expect(modalText).toBeTruthy()
    expect(closeButton).toBeTruthy()
})



