import { render } from '@testing-library/react-native'
import React from 'react'
import Slide from '../Slide'

it('Should renders items correctly', () => {
    const { getByTestId } = render(<Slide />)

    const titleImg = getByTestId('titleImg')
    const subtitle = getByTestId('subtitle')
    const image = getByTestId('image')

    expect(titleImg).toBeDefined()
    expect(subtitle).toBeDefined()
    expect(image).toBeTruthy()
})