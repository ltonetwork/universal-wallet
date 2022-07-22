import React from "react"
import OverviewHeader from "../../src/components/OverviewHeader"
import { render } from "@testing-library/react-native"

it("Should renders correctly", () => {
    const { getByTestId } = render(<OverviewHeader icon={""} input={undefined} />)
    expect(getByTestId("logo-title")).toBeTruthy()
})
