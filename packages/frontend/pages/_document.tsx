import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const originalRenderPage = ctx.renderPage;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ctx.renderPage = () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        originalRenderPage({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
