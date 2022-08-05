import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { Helmet } from "react-helmet"
import "../styles/style.scss"

export default function SEO({ title }) {
  return (
    <Helmet>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-7WPVHL3XBS"
      ></script>
      <script>{`
      window.dataLayer = window.dataLayer || [];
      function gtag() {
          dataLayer.push(arguments)
      }
      gtag('js', new Date()); gtag('config', 'G-7WPVHL3XBS');
      `}</script>
      <title>{title}</title>
    </Helmet>
  )
}
