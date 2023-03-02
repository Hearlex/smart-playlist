import '@/styles/globals.css'
import '@fontsource/public-sans';
import { ThemeProvider } from '@mui/joy';

export default function App({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  )
}
