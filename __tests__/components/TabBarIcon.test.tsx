import React from "react"
import { render } from "@testing-library/react-native"
import TabBarIcon from "../../src/components/TabBarIcon"

it("Should renders correctly", () => {
    const { getByTestId } = render(<TabBarIcon icon={"bookmark-box-multiple-outline"} color={"#ffffff"} />)

    expect(getByTestId("tab-bar-icon")).toBeTruthy()
})
