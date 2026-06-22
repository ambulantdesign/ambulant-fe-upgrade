/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React from "react"
import { CtxProvider } from "./src/context/AppContext"
import { InstantSearch } from "react-instantsearch"
import algoliasearch from "algoliasearch/lite"
require("./src/assets/css/global.css")

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
)

const routing = {
  stateMapping: {
    // Nur den "query"-Parameter in die URL schreiben, nicht den gesamten Suchstatus
    stateToRoute(uiState) {
      const indexUiState = uiState[indexName] || {}
      return { q: indexUiState.query }
    },
    routeToState(routeState) {
      return {
        indexName: {
          query: routeState.q,
        },
      }
    },
  },
}

export const wrapPageElement = ({ element, props }) => (
  <InstantSearch
    searchClient={searchClient}
    indexName={indexName}
    routing={routing}
    future={{ preserveSharedStateOnUnmount: true }}
  >
    {element}
  </InstantSearch>
)

export const wrapRootElement = ({ element }) => (
  <CtxProvider>{element}</CtxProvider>
)
