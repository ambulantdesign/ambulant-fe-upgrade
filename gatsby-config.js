/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

// Initialize dotenv
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const { populate } = require("dotenv")
const queries = require("./src/utils/algolia")

const strapiConfig = {
  apiURL: process.env.STRAPI_API_URL || `http://localhost:1337`,
  accessToken: process.env.STRAPI_TOKEN,
  maxParallelRequests: 2,
  collectionTypes: [
    {
      singularName: `work`,
      queryParams: {
        populate: {
          meta: "*",
          artist: "*",
          keywords: "*",
          institution: "*",
          Gallery: { populate: "*" },
          Weblink: "*",
          Videos: {
            populate: "*",
          },
          streamingVideo: "*",
          seo: { populate: "*" },
        },
      },
    },
    {
      singularName: `archive-item`,
      queryParams: {
        populate: {
          artist: "*",
          Gallery: { populate: "*" },
          sliderImgTxt: { populate: "*" },
        },
      },
    },
    `keyword`,
    `artist`,
    `institution`,
  ],
  singleTypes: [
    {
      singularName: `about`,
      queryParams: {
        populate: {
          MarginalColumn: {
            populate: "*",
          },
          streamingVideo: { populate: "*" },
          marginalTxt: { populate: "*" },
          seo: { populate: "*" },
        },
      },
    },
    {
      singularName: `contact`,
      queryParams: {
        populate: {
          MarginalColumn: { populate: "*" },
          streamingVideo: { populate: "*" },
          marginalTxt: { populate: "*" },
          seo: { populate: "*" },
        },
      },
    },
    {
      singularName: `imprint`,
      queryParams: {
        populate: {
          seo: { populate: "*" },
        },
      },
    },
  ],
  // 🔑 THIS IS THE MISSING PIECE
  media: {
    download: true,
  },
  queryLimit: 100,
}

module.exports = {
  // site config
  siteMetadata: {
    title: `ambulant design`,
    studioName: `studio ambulant design`,
    city: `Amsterdam`,
    description: `One-woman-studio for visual communication and editorial design based in Amsterdam, The Netherlands | Book | Catalog | Museum | Gallery | Artists | Publisher | Visual Identity | CI`,
    archiveDescription: `Emblematic works from the early years (1985 – 2005) of studio ambulant design – Gabriele Franziska Götz | Book | Catalog | Museum | Gallery | Artists | Publisher | Visual Identity | CI`,
    author: `Gabriele Franziska Götz`,
    authorShort: `Gabriele Götz`,
    jobDesc: `graphic designer`,
    siteUrl: process.env.GATSBY_SITE_URL,
    phone: `+31206890280`,
    email: process.env.GATSBY_FORMIK_EMAIL,
    seo: {
      google: `FiqFQFGBeFJGzpoQ4QmIC3eQPp2BfNxwKisK57StmpM`,
      bing: `767B33DB3497D2F5C7FAD3E74DC065CF`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      // ACHTUNG: Eine _headers-Datei im Projekt-Root wird NICHT gelesen.
      // Netlify wertet ausschliesslich public/_headers aus, und diese Datei
      // erzeugt das Plugin komplett neu aus den Optionen unten
      // (build-headers-program.js: writeHeadersFile schreibt in den
      // public-Ordner). Alle Header gehoeren deshalb hierher.
      //
      // mergeSecurityHeaders: false, weil der Standardsatz des Plugins
      // "Referrer-Policy: same-origin" enthaelt (constants.js Zeile 23).
      // Damit sendet der Browser an fremde Hosts gar keinen Referer —
      // OpenStreetMap verlangt aber einen und blockt die Kartenkacheln
      // mit "Access blocked / Referer is required by tile usage policy".
      resolve: `gatsby-plugin-netlify`,
      options: {
        mergeSecurityHeaders: false,
        headers: {
          "/*": [
            "X-Frame-Options: DENY",
            "X-XSS-Protection: 1; mode=block",
            "X-Content-Type-Options: nosniff",
            "Referrer-Policy: strict-origin-when-cross-origin",
          ],
        },
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-styled-components`,
    {
      // Künstlerseiten mit genau einer Arbeit werden per 301 auf die
      // Detailseite geleitet (siehe gatsby-node.js). Sie dürfen deshalb
      // nicht in der Sitemap stehen — sonst bittet man Google um die
      // Indexierung einer Seite, die sich selbst wegleitet.
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allStrapiWork {
              nodes {
                slug
                artist {
                  slug
                }
              }
            }
          }
        `,
        resolveSiteUrl: ({ site }) =>
          site.siteMetadata.siteUrl || process.env.GATSBY_SITE_URL,
        resolvePages: ({ allSitePage, allStrapiWork }) => {
          const withSlash = p => (p.endsWith("/") ? p : `${p}/`)

          const workCountByArtist = new Map()
          allStrapiWork.nodes.forEach(work => {
            const artistSlug = work.artist?.slug
            if (!artistSlug) return
            workCountByArtist.set(
              artistSlug,
              (workCountByArtist.get(artistSlug) || 0) + 1,
            )
          })

          const redirectedArtistPaths = new Set(
            Array.from(workCountByArtist.entries())
              .filter(([, count]) => count === 1)
              .map(([slug]) => withSlash(`/artists/${slug}`)),
          )

          return allSitePage.nodes.filter(
            page => !redirectedArtistPaths.has(withSlash(page.path)),
          )
        },
        serialize: ({ path }) => ({ url: path }),
      },
    },
    {
      resolve: `gatsby-source-strapi`,
      options: strapiConfig,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              width: 800,
              ratio: 1.77,
              related: false,
              noIframeBorder: true,
            },
          },
          `gatsby-remark-responsive-iframe`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require("./src/utils/algolia"),
        chunkSize: 10000, // default: 1000,
        enablePartialUpdates: true,
        skipIndexing: process.env.BRANCH !== "main", // skip indexing except the main branch
      },
    },
    {
      resolve: `gatsby-plugin-react-leaflet`,
      options: {
        linkStyles: false,
      },
    },
  ],
}
