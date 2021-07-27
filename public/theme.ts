import { extendTheme, ColorMode } from "@chakra-ui/react"

const config = {
  initialColorMode: "light" as ColorMode,
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

export default theme
