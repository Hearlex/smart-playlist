import '@/styles/globals.css'
import '@fontsource/public-sans';
import 'react-jinke-music-player/assets/index.css'
import { createContext, useState } from 'react';
import React from 'react';
import Layout from '@/components/layout';
import { CssVarsProvider, ThemeProvider } from '@mui/joy/styles';
import { getInitColorSchemeScript } from '@mui/joy/styles';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export default function App({ Component, pageProps, playList }) {
 /*  const [footerInstance, setFooterInstance] = useState(null); */
  let footerInstance = React.useRef(null);
  const [refreshPlayer, setRefreshPlayer] = useState(null);
  var theme = createTheme();

  theme.typography.h2 = {
    fontSize: '2.5vw',
  };
  theme.typography.h4 = {
    fontSize: '1.5vw',
  };
  return (
      <CssVarsProvider defaultMode='dark'>
        {getInitColorSchemeScript()}
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} refreshPlayer = {refreshPlayer}/>
          </Layout>
        </ThemeProvider>
      </CssVarsProvider>
  )
}