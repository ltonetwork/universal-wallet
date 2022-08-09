import React from "react"
import OverviewHeader from "../../src/components/OverviewHeader"
import { render } from "@testing-library/react-native"

const mockedProps = {
    onPress: jest.fn(),
    icon: "menu",
    input: <>  </>,
}

it("Should renders correctly", () => {
    const { getByRole, getByText } = render(<OverviewHeader {...mockedProps} />)

    const iconButton = getByRole("button")
    const input = getByText("")

    expect(iconButton).toBeTruthy()
    expect(input).toBeTruthy()
})
