import React from "react"
import { render } from "@testing-library/react-native"
import Spinner from "../../src/components/Spinner"

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

it("Should renders correctly", () => {
    const { getByTestId } = render(<Spinner />)

    expect(getByTestId("spinner")).toBeTruthy()
})