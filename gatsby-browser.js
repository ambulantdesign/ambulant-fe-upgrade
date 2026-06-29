/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
// import React from "react"
// import { CtxProvider } from "./src/context/AppContext"
// import { InstantSearch } from "react-instantsearch"
// import {
//   searchClient,
//   indexName,
//   routing,
// } from "./src/utils/algolia-search-config"
// require("./src/assets/css/global.css")

// export const wrapPageElement = ({ element, props }) => (
//   <InstantSearch
//     searchClient={searchClient}
//     indexName={indexName}
//     routing={routing}
//     future={{ preserveSharedStateOnUnmount: true }}
//   >
//     {element}
//   </InstantSearch>
// )

// export const wrapRootElement = ({ element }) => (
//   <CtxProvider>{element}</CtxProvider>
// )

// gatsby-browser.js
import React, { lazy, Suspense } from "react"
import { CtxProvider } from "./src/context/AppContext"
import {
  searchClient,
  indexName,
  routing,
} from "./src/utils/algolia-search-config"
require("./src/assets/css/global.css")

const InstantSearch = lazy(() =>
  import("react-instantsearch").then(mod => ({ default: mod.InstantSearch })),
)

export const wrapPageElement = ({ element, props }) => (
  <Suspense fallback={element}>
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      routing={routing}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      {element}
    </InstantSearch>
  </Suspense>
)

export const wrapRootElement = ({ element }) => (
  <CtxProvider>{element}</CtxProvider>
)
