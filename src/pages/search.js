import * as React from "react"
import { useRef } from "react"
import { useInstantSearch, useSearchBox } from "react-instantsearch"
import styled from "styled-components"

import Layout from "../components/Layout"
import Seo from "../components/Seo"
import Loading from "../components/ui/Loading"
import CustomSearch from "../components/search"
import ContentHeader from "../components/ContentHeader"

function LoadingIndicator() {
  const { status } = useInstantSearch()
  const loaderRef = useRef()

  if (status !== "stalled") return null

  return (
    <Loading
      elemId="spinner"
      wrapperClasses="loading-spinner--alt"
      refHandle={loaderRef}
    />
  )
}

export default function SearchPage() {
  const { query } = useSearchBox()
  const headline = query ? `Search for "${query}"` : "All entries"

  return (
    <Layout id="search">
      <Wrapper className="search" id="main">
        <LoadingIndicator />
        <ContentHeader title={headline} subtitle="" />
        <section className="grid gap-x-0 sm:gap-12 container " id="content">
          <div className="col-1">
            <CustomSearch />
          </div>
          <div className="col-2"></div>
        </section>
      </Wrapper>
    </Layout>
  )
}

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;

  .grid > .col-1 {
    grid-column: span 8;
  }
  .grid > .col-2 {
    grid-column: span 4;
  }
  .grid > .col-1 h2 {
    font-weight: 400;
    color: inherit;
    margin-bottom: 0;
  }
  .grid#content footer {
    grid-column: span 12;
  }
  .grid > .col-1 ul {
    margin-left: 0;
    list-style: none;
    counter-reset: my-awesome-counter;
  }
  .grid > .col-1 ul li {
    color: var(--clr-grey-2);
    line-height: 1.2;
    counter-increment: my-awesome-counter;
  }
  .grid > .col-1 ul li::before {
    content: counter(my-awesome-counter) ". ";
    font-size: 1.875em;
    font-weight: 400;
    color: var(--clr-grey-2);
  }
  .hit-count {
    padding-bottom: 0.5em;
  }
  @media screen and (max-width: 900px) {
    .grid > .col-1,
    .grid > .col-2 {
      grid-column: span 12;
      padding-bottom: var(--space-4);
    }
    .grid > .col-2 {
      display: none;
    }
  }
`

export const Head = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const query = params.get("q")
  const searchString = query ? `Search for "${query}"` : "Search"

  return (
    <Seo
      title={searchString}
      attachDefault={true}
      pathname={location.pathname}
    />
  )
}
