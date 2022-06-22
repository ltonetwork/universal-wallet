import React from "react"
import LogoTitle from "../../src/components/LogoTitle"
import { render } from "@testing-library/react-native"

it("Should renders correctly", () => {
    const { getByTestId } = render(<LogoTitle />)

    expect(getByTestId("logo-title")).toBeTruthy()
})
