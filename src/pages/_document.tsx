import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"

import { ColorModeScript } from "@chakra-ui/react"

import theme from "public/theme"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>,
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <script src="theme.ts" />

        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />

          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
