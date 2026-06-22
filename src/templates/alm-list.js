import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"
import { graphql, withPrefix, navigate } from "gatsby"
import styled from "styled-components"
import { FaParagraph } from "react-icons/fa"

import Layout from "../components/Layout"
import Loading from "../components/ui/Loading"
import Seo, { JsonLd } from "../components/Seo"
import ContentHeader from "../components/ContentHeader"
import GridProject from "../components/GridProject"
import NoResults from "../components/NoResults"

import { useSiteMetadata } from "../hooks/use-site-metadata"
import {
  randomGalleryItem,
  artGalleryListOrder,
  getWorkImageUrl,
} from "../utils/gallery-helper"

import * as styles from "../assets/css/index.module.css"

const AlmListPage = ({ data, pageContext }) => {
  const { artists, keywords, institutions } = data
  const { title, contentType } = pageContext
  const [sliceLength, setSliceLength] = useState(
    parseInt(process.env.GATSBY_POSTS_FIRST_PAGE),
  )

  let projects

  if (contentType === "artists") {
    projects = artists.nodes
  }
  if (contentType === "keywords") {
    projects = keywords.nodes
  }

  // ************** //

  projects = artGalleryListOrder(projects, institutions.nodes, "end")

  // ************** //

  const loaderRef = useRef()
  const gridRef = useRef()

  const noresults = projects.length <= 0

  // CSS class for fade-in animation of last added item
  const [fadeIn, setFadeIn] = useState("")

  // State for the list
  const [list, setList] = useState([...projects.slice(0, sliceLength)])

  // current length of list
  const [oldItems, setOldItems] = useState(list.length)

  // State to trigger load more
  const [loadMore, setLoadMore] = useState(false)

  // State of whether there is more to load
  const [hasMore, setHasMore] = useState(projects.length > sliceLength)

  // Handle loading more articles
  useEffect(() => {
    setSliceLength(parseInt(process.env.GATSBY_POSTS_ON_ALM))
    if (loadMore && hasMore) {
      const currentLength = list.length
      const isMore = currentLength < projects.length
      const nextResults = isMore
        ? projects.slice(currentLength, currentLength + sliceLength)
        : []
      setList([...list, ...nextResults])
      setLoadMore(false)
      setOldItems(list.length)
    }
  }, [loadMore, hasMore]) //eslint-disable-line

  // Check if there is more
  useEffect(() => {
    // programmatically navigate to detail page if there is only one work
    if (list.length === 1 && contentType === "artists") {
      const { slug } = projects[0]
      navigate(`/works/${slug}`, { replace: true })
    }
    const isMore = list.length < projects.length
    setHasMore(isMore)
  }, [list]) //eslint-disable-line

  // Check if element added to current list
  useEffect(() => {
    loaderRef.current.style.display = "none"
    gridRef.current.style.opacity = "100"
    if (!oldItems) return
    let timeout = setTimeout(() => setFadeIn("fade"), 500)
    return () => {
      clearTimeout(timeout)
      setFadeIn("")
    }
  }, [oldItems]) //eslint-disable-line

  return (
    <>
      <Layout>
        <Wrapper className={styles.portfolio} id="main">
          <ContentHeader title={title} display={false} />
          {noresults && <NoResults tagName={title} />}
          <Loading
            elemId="spinner"
            wrapperClasses="loading-spinner"
            refHandle={loaderRef}
          />

          <div
            className={styles.portfolioGrid}
            id="portfolio-grid"
            ref={gridRef}
          >
            {projects.length > 0 &&
              list.map((project, index) => {
                const { id, title, slug, artist, Gallery, institution } =
                  project
                const isNew = index >= oldItems && index < projects.length
                // const extraClass = isNew ? fadeIn : `old`
                const extraClass = isNew ? `new ${fadeIn}` : `old`

                return (
                  <div
                    className={`${styles.work} ${extraClass} gridItem`}
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
            <div className="btn-container">
              {hasMore ? (
                <button
                  type="button"
                  className="w-full btn-solid py-2 px-8 border rounded inline-block"
                  onClick={() => setLoadMore(true)}
                >
                  Load More
                </button>
              ) : (
                <div className="big">
                  <FaParagraph />
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      </Layout>
    </>
  )
}

const Wrapper = styled.main`
  .big {
    font-size: 1.875em;
    color: var(--clr-grey-3);
  }
  .gridItem.new {
    opacity: 0;
  }
  .gridItem.fade {
    animation-duration: 0.7s;
    animation-name: fadeIn;
    animation-timing-function: ease-in;
    animation-fill-mode: forwards;
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      visibility: hidden;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      visibility: hidden;
    }

    to {
      opacity: 1;
    }
  }
`

export const query = graphql`
  query ListView($slug: String!) {
    keywords: allStrapiWork(
      filter: { keywords: { elemMatch: { slug: { eq: $slug } } } }
      sort: { productionDate: DESC }
    ) {
      nodes {
        id
        title
        slug
        productionDate
        artist {
          fullname
          slug
        }
        keywords {
          name
        }
        meta {
          year
          id
        }
        institution {
          id
          name
          sortName
          colorCode
        }
        Gallery {
          id
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
    artists: allStrapiWork(
      filter: { artist: { slug: { eq: $slug } } }
      sort: [{ productionDate: DESC }, { slug: ASC }]
    ) {
      nodes {
        id
        title
        slug
        productionDate
        artist {
          fullname
          slug
        }
        keywords {
          name
        }
        meta {
          year
          id
        }
        institution {
          id
          name
          sortName
          colorCode
        }
        Gallery {
          id
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
        colorCode
      }
    }
  }
`

export const Head = ({ location, data, pageContext }) => {
  const { artists, keywords } = data
  const [seoImg, setSeoImg] = React.useState(null)
  const { studioName, city, author } = useSiteMetadata()
  const { title, contentType } = pageContext

  let seoTitle, seoDesc, projects, collectionTypeLabel

  if (contentType === "artists") {
    projects = artists.nodes
    seoTitle = `Artist: ${title}`
    collectionTypeLabel = "artist"
  }
  if (contentType === "keywords") {
    projects = keywords.nodes
    seoTitle = `Keyword: ${title}`
    collectionTypeLabel = "keyword"
  }

  seoDesc = `Works by ${author} related to ${seoTitle
    .split(":")
    .join("")} | ${studioName} – ${city}`

  useMemo(() => {
    if (projects && projects.length > 0) {
      const { Gallery } = projects[Math.floor(Math.random() * projects.length)]
      setSeoImg(randomGalleryItem(Gallery))
    }
  }, [projects])

  const siteUrl = process.env.GATSBY_SITE_URL
  const canonical = `${siteUrl}${location.pathname}`

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collectionpage`,
    name: seoTitle,
    headline: seoTitle,
    description: seoDesc,
    url: canonical,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@type": "Thing",
      name: title,
      additionalType: collectionTypeLabel,
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
  }

  return (
    <>
      <script src={withPrefix("/js/autoGrid.js")} type="text/javascript" />
      <Seo
        title={seoTitle}
        attachDefault={true}
        description={seoDesc}
        image={seoImg}
        pathname={location.pathname}
      >
        <JsonLd data={collectionSchema} />
      </Seo>
    </>
  )
}

export default AlmListPage
