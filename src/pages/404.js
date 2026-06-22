import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import Seo from "../components/Seo"
import ContentHeader from "../components/ContentHeader"
import styled from "styled-components"

const NotFoundPage = () => (
  <Layout>
    <Wrapper className="portfolio" id="main">
      <ContentHeader title={"Oops – Page not found"} subtitle={""} />
      <section className="grid gap-x-0 sm:gap-10 container " id="content">
        <div className="col-1">
          <p>😔 Sorry, we couldn’t find what you were looking for.</p>
          <p>Please use the navigation, the full-text search or …</p>
          <p>
            <Link
              className="text-center bg-transparent py-2.5 px-4 mr-4 border rounded nav-btn"
              to="/"
            >
              Go back home
            </Link>
          </p>
        </div>
        <div className="col-2"></div>
        <footer className="my-10"></footer>
      </section>
    </Wrapper>
  </Layout>
)
const Wrapper = styled.main`
  .grid > .col-1 {
    grid-column: span 8;
  }
  .grid > .col-2 {
    grid-column: span 4;
  }
  .grid#content footer {
    grid-column: span 12;
  }
`

export const Head = () => <Seo title="404 – Not Found" attachDefault={true} />

export default NotFoundPage
