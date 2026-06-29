import * as React from "react"
import { useRef, useEffect, useMemo } from "react"
import { graphql, withPrefix } from "gatsby"
import { useSiteMetadata } from "../hooks/use-site-metadata"

import Layout from "../components/Layout"
import Loading from "../components/ui/Loading"
import Seo, { JsonLd } from "../components/Seo"
import GridProject from "../components/GridProject"
import {
  randomGalleryItem,
  artGalleryListOrder,
  getWorkImageUrl,
} from "../utils/gallery-helper"

import * as styles from "../assets/css/index.module.css"

var _ = require("lodash")

const IndexPage = ({ data }) => {
  const [randomProjects, setRandomProjects] = React.useState([])
  const loaderRef = useRef()
  const gridRef = useRef()
  const {
    allStrapiWork: { nodes: projects },
    institutions,
  } = data

  useEffect(() => {
    loaderRef.current.style.display = "none"
    gridRef.current.style.opacity = "100"

    let homeProjects = _.sampleSize(
      projects,
      parseInt(process.env.GATSBY_POSTS_FIRST_PAGE),
    )

    homeProjects = _.orderBy(
      homeProjects,
      ["productionDate", "slug"],
      ["desc", "asc"],
    )

    // ************** //

    homeProjects = artGalleryListOrder(homeProjects, institutions.nodes, "end")

    // ************** //

    setRandomProjects(homeProjects)
  }, [data, projects, institutions.nodes])

  return (
    <>
      <Layout id="home">
        <main className={styles.portfolio} id="main">
          <Loading
            elemId="spinner"
            wrapperClasses="loading-spinner"
            refHandle={loaderRef}
          />

          <div
            className={styles.portfolioGrid}
            id="portfolio-grid"
            style={{}}
            ref={gridRef}
          >
            {randomProjects &&
              randomProjects.map(project => {
                const { id, title, slug, artist, Gallery, institution } =
                  project

                return (
                  <div
                    className={`${styles.work} gridItem`}
                    key={id}
                    id={`gridItem-${id}`}
                  >
                    <GridProject
                      id={id}
                      title={title}
                      slug={slug}
                      artist={artist}
                      gallery={Gallery}
                      institution={institution}
                    />
                  </div>
                )
              })}
          </div>
        </main>
      </Layout>
    </>
  )
}

export const query = graphql`
  {
    allStrapiWork(sort: [{ productionDate: DESC }, { slug: ASC }]) {
      nodes {
        id: strapi_id
        title
        slug
        productionDate
        keywords {
          name
          slug
        }
        artist {
          fullname
          slug
        }
        meta {
          medium
          info
          ISBN
          city
          commissioner
          format
          publisher
          technical_details
          year
          id: strapi_id
        }
        institution {
          id
          name
          sortName
          colorCode
        }
        Gallery {
          id: strapi_id
          caption
          localFile {
            childImageSharp {
              gatsbyImageData(
                layout: CONSTRAINED
                placeholder: BLURRED
                height: 300
              )
            }
          }
        }
      }
    }
    institutions: allStrapiInstitution(sort: { sortName: ASC }) {
      nodes {
        name
        sortName
      }
    }
  }
`

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ location, data }) => {
  const [seoImg, setSeoImg] = React.useState(null)
  const { studioName, city, description, author } = useSiteMetadata()
  const {
    allStrapiWork: { nodes: projects },
  } = data

  let seoTitle

  seoTitle = `Portfolio of ${author} | ${studioName} – ${city}`

  const featuredProjects = projects.slice(
    0,
    parseInt(process.env.GATSBY_POSTS_FIRST_PAGE),
  )

  useMemo(() => {
    if (featuredProjects && featuredProjects.length > 0) {
      const { Gallery } =
        featuredProjects[Math.floor(Math.random() * featuredProjects.length)]
      setSeoImg(randomGalleryItem(Gallery))
    }
  }, [])

  const siteUrl = process.env.GATSBY_SITE_URL
  const canonical = `${siteUrl}${location.pathname}`

  const collectionSchema = projects => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collectionpage`,
    name: seoTitle,
    headline: seoTitle,
    url: canonical,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          "@id": `${siteUrl}/works/${project.slug}/#creativework`,
          name: project.title,
          url: `${siteUrl}/works/${project.slug}/`,
          image: getWorkImageUrl(project),
          thumbnailUrl: getWorkImageUrl(project),
          creator: project.artist?.fullname
            ? {
                "@type": "Person",
                name: project.artist.fullname,
                url: project.artist.slug
                  ? `${siteUrl}/artists/${project.artist.slug}/`
                  : undefined,
              }
            : undefined,
          dateCreated: project.meta?.year
            ? String(project.meta.year)
            : undefined,
          genre: project.keywords?.map(keyword => keyword.name),
        },
      })),
    },
  })

  return (
    <>
      <script
        src={withPrefix("/js/autoGrid.js")}
        type="text/javascript"
        defer
      />
      <Seo
        title={seoTitle}
        attachDefault={false}
        description={description}
        image={seoImg}
        pathname={location.pathname}
      >
        <JsonLd data={collectionSchema(featuredProjects)} />
      </Seo>
    </>
  )
}
export default IndexPage
