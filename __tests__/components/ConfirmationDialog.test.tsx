import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import ConfirmationDialog from '../../src/components/ConfirmationDialog'

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

const mockedState = {
    visible: true,
    message: '',
    cancelPress: jest.fn,
    onPress: jest.fn,
}

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native')
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
        }),
    }
})

jest.mock('react-native-paper', () => {
    const React = require('react')
    const { View } = require('react-native')
    const RealModule = jest.requireActual('react-native-paper')
    const MockedModule = {
        ...RealModule,
        Portal: ({ children }: any) => <View>{children}</View>,
    }
    return MockedModule
})

it('Should shows a dialog and cancel/continue buttons', () => {
    const { getByText, getByRole, getByTestId } = render(
        <ConfirmationDialog
            visible={true}
            onPress={mockedState.onPress}
            message={''}
            cancelPress={mockedState.cancelPress}
        />
    )

    const dialog = getByText('Confirm:')
    const cancelButton = getByTestId('cancel')
    const continueButton = getByTestId('continue')

    expect(dialog).toBeTruthy()
    expect(cancelButton).toBeTruthy()
    expect(continueButton).toBeTruthy()
})

it('Should do nothing and navigate to dashboard screen', () => {
    const { getByTestId } = render(
        <ConfirmationDialog visible={true} onPress={mockedNavigate} message={''} cancelPress={mockedNavigate} />
    )

    const cancelButton = getByTestId('cancel')
    fireEvent.press(cancelButton)

    expect(mockedNavigate).toHaveBeenCalled()
})

it('Should execute transaction and navigate to dashboard screen', () => {
    const { getByTestId } = render(
        <ConfirmationDialog visible={true} onPress={mockedNavigate} message={''} cancelPress={mockedNavigate} />
    )

    const continueButton = getByTestId('continue')
    fireEvent.press(continueButton)

    expect(mockedNavigate).toHaveBeenCalled()
})
