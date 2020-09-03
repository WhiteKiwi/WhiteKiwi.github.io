import React from "react"
import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }) {
    return (
        <>
            <Header />

            <div
                style={{
                    backgroundColor: "#202125",
                }}
            >
                {children}
            </div>

            <Footer />
        </>
    )
}
