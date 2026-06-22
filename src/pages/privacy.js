import * as React from "react"
import { graphql, Script, withPrefix } from "gatsby"
import styled from "styled-components"

import Layout from "../components/Layout"
import ContentHeader from "../components/ContentHeader"
import Seo from "../components/Seo"
import RichTextContent from "../components/RichTextContent"
import CookieSwitch from "../components/CookieSwitch"

const PrivacyPage = ({ data }) => {
  const {
    title,
    content: {
      data: { content },
    },
  } = data.page

  const { allProviders } = data.allStreamingVideo
  const providers = []

  const uniques = [...new Set(allProviders.map(obj => obj.streamingPlatform))]

  uniques.map(platform => {
    return providers.push({
      platform: platform,
      cookieName: `accept${platform}Cookies`,
    })
  })

  return (
    <>
      <Layout id="privacy">
        <Wrapper className="portfolio" id="main">
          <ContentHeader title={title} subtitle={""} />
          {/* <section className="container mb-8 heroContainer" id="hero">
            full-width placeholder
          </section> */}
          <section className="grid gap-x-0 sm:gap-10" id="content">
            <div className="col-1">
              <RichTextContent content={content} />
            </div>
            <div className="col-2">
              <div className="yt-consent py-2 px-4 border-transparent rounded">
                <h4 className="mb-4">Cookie consent for video streams</h4>
                <p>
                  Change your browser settings to permit or refuse the use of
                  cookies by the following video streaming platforms used on
                  this website:
                </p>
                {providers.map((provider, index) => (
                  <CookieSwitch key={index} provider={provider} />
                ))}
              </div>
              <RichTextContent content={`<p></p>`} />
            </div>
            <footer className="my-10"></footer>
          </section>
        </Wrapper>
      </Layout>
      <Script src={withPrefix("/js/flowbite.min.js")} type="text/javascript" />
    </>
  )
}

const Wrapper = styled.main`
  .grid > .col-1 {
    grid-column: span 8;
  }
  .grid > .col-2 {
    grid-column: span 4;
  }
  .grid > .col-1 div {
    max-width: clamp(40vw, min(90vw, 70ch), 95ch);
  }
  .grid#content footer {
    grid-column: span 12;
  }
  .yt-consent {
    background-color: var(--clr-sand);
  }
  @media screen and (max-width: 640px) {
    .grid > .col-1,
    .grid > .col-2 {
      grid-column: span 12;
      padding-bottom: var(--space-4);
    }
  }
`

export const data = graphql`
  fragment seoFields on STRAPI__COMPONENT_SEO_SEO_BASIC_FIELDS {
    seo_title
    seo_description
    seo_image {
      localFile {
        childImageSharp {
          fixed {
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
  }
  {
    page: strapiImprint {
      id
      title
      content {
        data {
          content
        }
      }
      seo {
        ...seoFields
      }
    }
    allStreamingVideo: allStrapiComponentMediaStreamingVideo {
      allProviders: nodes {
        id: strapi_id
        streamingPlatform
      }
    }
  }
`
export const Head = ({ location, data }) => {
  const { page } = data
  return (
    <Seo
      title={page?.seo?.seo_title || `Privacy & Disclaimer`}
      attachDefault={true}
      description={page?.seo?.seo_description || null}
      image={page?.seo?.seo_image || null}
      pathname={location.pathname}
    />
  )
}

export default PrivacyPage
