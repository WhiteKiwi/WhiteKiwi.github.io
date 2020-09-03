import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.scss"

export default function Home() {
	return (
		<Layout>
			<SEO title="Kiwi's Portfolio" />

			<h1>Hello world!</h1>
		</Layout>
	)
}
