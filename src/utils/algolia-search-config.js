// src/utils/algolia-search-config.js
import algoliasearch from "algoliasearch/lite"

export const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

export const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
)

export const routing = {
  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState[indexName] || {}
      return { q: indexUiState.query }
    },
    routeToState(routeState) {
      return {
        [indexName]: {
          query: routeState.q,
        },
      }
    },
  },
}
