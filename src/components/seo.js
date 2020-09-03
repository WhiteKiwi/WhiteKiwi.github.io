import React from "react"
import { Helmet } from "react-helmet"
import "bootstrap/dist/css/bootstrap.min.css"

export default function SEO({ title }) {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    )
}
