import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { Fragment, useEffect } from 'react'
import { freezeGlobal, assignFingerprint, splitInGrid } from '../Utility/Utility'
import { Background } from '../comps/Background'
import { unstable_createMuiStrictModeTheme as createTheme, MuiThemeProvider } from '@material-ui/core/styles'
import {global} from '../Utility/Utility'

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      primary: { main: '#180C1F' },
      secondary: { main: '#FFE6B1', dark: '#FFC64C' },
      type: 'dark'
    },
  });
  
  useEffect(() => {
    const init = async() => { //can't have async useEffect
      splitInGrid(global.gridCells, window.innerWidth, window.innerHeight)
      var result = await assignFingerprint()
      freezeGlobal()
    }
    init();
}, [])

  return (
  <Fragment>
     <MuiThemeProvider theme={theme}>
        <Background></Background>
        <Component {...pageProps} />
     </MuiThemeProvider>
  </Fragment>

  )
}
export default MyApp
