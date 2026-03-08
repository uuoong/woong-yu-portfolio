import Head from '@/components/Head/Head'
import Layout from '@/components/Layout/Layout'
import { ScrollProvider } from '@/context/Scroll'
import useRemSizing from '@/hooks/use-rem-sizing'
import useStore from '@/store'
import '@/styles/global.scss'
import { deviceInfo } from '@/utils'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

export default function App({ Component, pageProps }) {
  const hasSetGlobalData = useRef(false)
  const setGlobalData = useStore(state => state.setGlobalData)
  const pageIsTransitioning = useStore(state => state.pageIsTransitioning)
  const enableInteraction = useStore(state => state.enableInteraction)
  const router = useRouter()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) return

    const handleRouteChange = url => {
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
          page_path: url,
        })
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useRemSizing()

  useEffect(() => {
    document.body.dataset.enableInteraction = !pageIsTransitioning
  }, [pageIsTransitioning])

  useEffect(() => {
    document.body.dataset.enableInteraction = enableInteraction
  }, [enableInteraction])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && window.location.href.indexOf('?nostat') === -1) {
      require('@jam3/stats')()
    }
  }, [])

  useEffect(() => {
    document.body.dataset.browser = deviceInfo.browser._parsedBrowserName.toLowerCase()
    document.body.dataset.os = deviceInfo.os._parsedOSName.toLowerCase()
  }, [])

  useEffect(() => {
    if (pageProps.globalSettings.navigation && !hasSetGlobalData.current) {
      hasSetGlobalData.current = true
      setGlobalData({
        navigation: pageProps.globalSettings.navigation,
      })
    }
  }, [pageProps, setGlobalData])

  return (
    <>
      <Head
        title={pageProps?.metadata?.title}
        description={pageProps?.metadata?.description}
        keywords={pageProps?.metadata?.keywords}
        shareImage={pageProps?.metadata?.image}
        favicon={pageProps?.metadata?.favicon}
        robots={pageProps?.metadata?.allowCrawlers}
      />
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
          </Script>
        </>
      )}
      <ScrollProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ScrollProvider>
    </>
  )
}
