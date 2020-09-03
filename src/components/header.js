import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import "../styles/header.scss"

export default function Header() {
    return (
        <Navbar variant="dark" fixed="top">
            <Navbar.Brand href="/">Kiwi&apos;s Footprints</Navbar.Brand>
            <Nav className="d-flex flex-row-reverse">
                <Nav.Link href="https://github.com/whitekiwi">
                    github
                </Nav.Link>
                <Nav.Link href="/blog">
                    blog
                </Nav.Link>
                <Nav.Link href="/skills">
                    skills
                </Nav.Link>
                <Nav.Link href="/projects">
                    projects
                </Nav.Link>
                <Nav.Link href="/about" active>
                    about
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
