import React from 'react'
import Head from 'next/head'
import '../styles/App.css'
import '../components/styles/frame.css'
import '../components/styles/header.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>The Boring ISS Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
