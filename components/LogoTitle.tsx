import React from "react"
import { StyledImage } from "./styles/LogoTitle.styles"

export default function LogoTitle() {
  return (
    <StyledImage
      source={require('../assets/images/brand_logo.png')}
    />
  )
}