/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { getSrc } from "gatsby-plugin-image"

const JsonLd = ({ data }) => {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

function Seo({
  description,
  image: og_thumbnail,
  title,
  attachDefault = true,
  pathname,
  children,
}) {
  const { site, twitterCardImg } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          studioName
          description
          author
          authorShort
          city
          siteUrl
          title
          seo {
            google
            bing
          }
        }
      }
      twitterCardImg: file(name: { eq: "twitter-card_ambulant-design" }) {
        id
        childImageSharp {
          fixed(width: 480) {
            ...GatsbyImageSharpFixed
          }
          gatsbyImageData(
            placeholder: NONE
            layout: FULL_WIDTH
            formats: NO_CHANGE
          )
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  let defaultTitle
  attachDefault
    ? (defaultTitle = `${site.siteMetadata?.studioName} – ${site.siteMetadata?.author}`)
    : (defaultTitle = false)

  let og_thumbnailW, og_thumbnailH
  let seoThumbnail =
    og_thumbnail && og_thumbnail.localFile
      ? `${process.env.GATSBY_SITE_URL}${getSrc(og_thumbnail.localFile)}`
      : null

  if (seoThumbnail === null) {
    seoThumbnail = `${process.env.GATSBY_SITE_URL}${getSrc(twitterCardImg)}`
    og_thumbnailW = "480"
    og_thumbnailH = "270"
  } else {
    og_thumbnailW =
      og_thumbnail?.localFile?.childImageSharp?.fixed?.width ||
      og_thumbnail?.localFile?.childImageSharp?.gatsbyImageData?.width
    og_thumbnailH =
      og_thumbnail?.localFile?.childImageSharp?.fixed?.height ||
      og_thumbnail?.localFile?.childImageSharp?.gatsbyImageData?.height
  }

  const canonical = pathname
    ? `${process.env.GATSBY_SITE_URL}${pathname}`
    : null

  const siteUrl = site.siteMetadata.siteUrl || process.env.GATSBY_SITE_URL

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: `${site.siteMetadata.studioName} | ${site.siteMetadata.city}`,
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.siteMetadata?.title,
    description: site.siteMetadata?.description,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  }

  return (
    <>
      <meta
        name="google-site-verification"
        content={site.siteMetadata?.seo?.google || ``}
      />
      <meta name="msvalidate.01" content={site.siteMetadata?.seo?.bing || ``} />
      <link rel="icon" href="/favicon.ico" sizes="any"></link>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      <link rel="manifest" href="/manifest.json"></link>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      ></link>
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      ></link>
      <link rel="manifest" href="/site.webmanifest"></link>
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color="#ce1b1c"
      ></link>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="description" content={metaDescription} />
      <meta
        property="og:title"
        content={defaultTitle ? `${title} | ${defaultTitle}` : title}
      />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />

      {seoThumbnail ? (
        <>
          <meta property="og:image" content={seoThumbnail} />
          <meta property="og:image:width" content={og_thumbnailW} />
          <meta property="og:image:height" content={og_thumbnailH} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image:src" content={seoThumbnail} />
        </>
      ) : (
        <meta name="twitter:card" content="summary" />
      )}

      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:url" content={canonical} />
      <meta
        name="twitter:title"
        content={defaultTitle ? `${title} | ${defaultTitle}` : title}
      />
      <meta name="twitter:description" content={metaDescription} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {children}
    </>
  )
}

Seo.defaultProps = {
  description: ``,
  title: ``,
  pathname: `/`,
  image: null,
}

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  pathname: PropTypes.string,
  image: PropTypes.shape({
    localFile: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fixed: PropTypes.oneOfType([
          PropTypes.shape({}),
          PropTypes.arrayOf(PropTypes.shape({})),
        ]),
        gatsbyImageData: PropTypes.oneOfType([
          PropTypes.shape({}),
          PropTypes.arrayOf(PropTypes.shape({})),
        ]),
      }),
    }),
  }),
  children: PropTypes.node,
}

export { JsonLd }
export default Seo
