import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.scss"
import Alert from "react-bootstrap/Alert"

export default function Home() {
	return (
		<Layout>
			<SEO title="Kiwi's Portfolio" />

			<h1>Hello world!</h1>
			{
				[
					"primary",
					"secondary",
					"success",
					"danger",
					"warning",
					"info",
					"light",
					"dark",
				].map((variant, idx) => (
					<Alert key={idx} variant={variant}>
						This is a {variant} alert—check it out!
					</Alert>
				))
			}
		</Layout>
	)
}
