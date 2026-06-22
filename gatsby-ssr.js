/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */
const React = require("react")
const { InstantSearch } = require("react-instantsearch")
const algoliasearch = require("algoliasearch/lite")

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
)

const routing = {
  stateMapping: {
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

exports.wrapPageElement = ({ element, props }) => (
  <InstantSearch
    searchClient={searchClient}
    indexName={indexName}
    routing={routing}
    future={{ preserveSharedStateOnUnmount: true }}
  >
    {element}
  </InstantSearch>
)

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `en` })
  // setHeadComponents([
  //   [
  //     <link
  //       key="karla-300"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-300.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //     <link
  //       key="karla-300-italic"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-300italic.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //     <link
  //       key="karla-400"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-regular.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //     <link
  //       key="karla-400-italic"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-italic.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //     <link
  //       key="karla-700"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-700.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //     <link
  //       key="karla-700-italic"
  //       rel="preload"
  //       href="/fonts/karla-v31-latin_latin-ext-700italic.woff2"
  //       as="font"
  //       type="font/woff2"
  //       crossOrigin="anonymous"
  //     />,
  //   ],
  // ])
}
