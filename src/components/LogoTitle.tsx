import React from "react"
import { logoTitle } from "../utils/images"
import { StyledImage } from "./styles/LogoTitle.styles"

export default function LogoTitle(): JSX.Element {
  return (
    <StyledImage testID="logo-title" source={logoTitle} />
  )
}