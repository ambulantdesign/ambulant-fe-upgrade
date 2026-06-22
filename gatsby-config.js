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
    siteUrl: `${process.env.GATSBY_SITE_URL}`,
    phone: `+31206890280`,
    email: `info@ambulantdesign.nl`,
    seo: {
      google: `FiqFQFGBeFJGzpoQ4QmIC3eQPp2BfNxwKisK57StmpM`,
      bing: `767B33DB3497D2F5C7FAD3E74DC065CF`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
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
        linkStyles: true,
      },
    },
  ],
}
