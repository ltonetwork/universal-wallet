import React from "react"
import { render } from "@testing-library/react-native"
import TabBarImage from "../../src/components/TabBarImage"
import { imagesIcon } from "../../src/utils/images"

it("Should renders correctly", () => {
    const { getByTestId } = render(<TabBarImage source={imagesIcon.wallet} />)

    const image = getByTestId("tabIconImage")

    expect(image).toBeTruthy()
})
