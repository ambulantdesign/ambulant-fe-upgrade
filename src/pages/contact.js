import * as React from "react"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Icon } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useHasMounted } from "../hooks/useHasMounted"
import styled from "styled-components"
import PropTypes from "prop-types"

import Layout from "../components/Layout"
import ContentHeader from "../components/ContentHeader"
import Seo from "../components/Seo"
import RichTextContent from "../components/RichTextContent"
import StreamingVideo from "../components/StreamingVideo"
import ContactForm from "../components/ContactForm"
import ContactOptions from "../components/ContactOptions"

import "leaflet/dist/leaflet.css"

// Eigener Marker in der Bildsprache des Studios (Logo-Form aus Footer.js).
// Ersetzt Leaflets Standard-Icon, das in Gatsby ohnehin nicht laedt: Leaflet
// ermittelt den Bildpfad zur Laufzeit aus dem background-image von
// .leaflet-default-icon-path in leaflet.css — webpack schreibt diese URL beim
// Build auf einen gehashten Pfad um, und Leaflets abgeleiteter Pfad geht ins
// Leere. Mit einem eigenen iconUrl entfaellt diese Pfaderkennung.
// Die Datei liegt in static/ und wird von Gatsby unveraendert kopiert,
// bekommt also keinen Hash.
// WICHTIG: nicht auf Modulebene instanziieren. Gatsby baut die Seiten in Node,
// dort liegt `Icon` nicht als Konstruktor vor und der Build bricht ab mit
// "TypeError: leaflet_src.Icon is not a constructor". Das Icon wird deshalb
// erst beim Rendern im Browser erzeugt und dann wiederverwendet.
let studioMarker = null
const getStudioMarker = () => {
  if (typeof window === "undefined") return undefined
  if (!studioMarker) {
    studioMarker = new Icon({
      iconUrl: "/marker-ambulant.svg",
      iconSize: [34, 33],
      // Die Logo-Form hat keine Spitze, der Ankerpunkt sitzt deshalb mittig.
      iconAnchor: [17, 17],
      popupAnchor: [0, -16],
    })
  }
  return studioMarker
}

const ContactPage = ({ data }) => {
  const {
    title,
    content: {
      data: { content },
    },
    MarginalColumn,
  } = data.page

  return (
    <Layout id="contact">
      <Wrapper className="portfolio" id="main">
        <ContentHeader title={title} subtitle={""} />
        <section className="container mb-8 heroContainer" id="map">
          {useHasMounted && (
            <MapContainer
              center={[52.36159, 4.858676]}
              zoom={16}
              style={{ height: "400px" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                // Die Tile Usage Policy nennt ausdruecklich diese eine URL.
                // Die alten a/b/c-Subdomains gelten als ueberholt und koennen
                // laut Policy "ohne Ankuendigung zurueckgezogen werden".
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[52.36159, 4.858676]} icon={getStudioMarker()}>
                <Popup minWidth="340">
                  <StaticImage
                    src="../assets/images/vis-card2.png"
                    alt="Gabriele Franziska Götz – business card ”studio ambulant design“"
                  />
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </section>
        <section className="grid gap-x-0 sm:gap-10" id="content">
          <div className="col-1">
            <h3>Send a message</h3>
            <ContactForm />
            <RichTextContent content={content} />
          </div>
          <div className="col-2">
            <ContactOptions headline="Contact Gabriele via" extraClass="mb-8" />
            {MarginalColumn.map((item, index) => {
              switch (item.__typename) {
                case "STRAPI__COMPONENT_LAYOUT_RICH_TEXT":
                  const {
                    marginalTxt: {
                      data: { marginalTxt },
                    },
                  } = item
                  return (
                    <RichTextContent
                      content={marginalTxt}
                      extraClass="contact"
                      key={index}
                    />
                  )
                case "STRAPI__COMPONENT_MEDIA_STREAMING_VIDEO":
                  return <StreamingVideo video={item} key={index} />
                default:
                  return <></>
              }
            })}
          </div>
          <footer className="my-10"></footer>
        </section>
      </Wrapper>
    </Layout>
  )
}

const Wrapper = styled.main`
  /* Leaflet vergibt intern hohe z-index-Werte: Panes 400–700, Controls 800,
	.leaflet-top/.leaflet-bottom sogar 1000. Der mobile Drawer liegt bei 199
	und der Header bei 150 — die Karte wuerde sich also ueber beide legen.
	isolation: isolate macht den Kartencontainer zu einem eigenen
	Stapelkontext. Damit gelten Leaflets Werte nur noch innerhalb der Karte,
	und die Karte selbst reiht sich als normales Element unter Drawer und
   Header ein. Kein Hochzaehlen von z-index-Werten noetig. */
  .leaflet-container {
    position: relative;
    z-index: 0;
    isolation: isolate;
  }
  .grid > .col-1 {
    grid-column: span 8;
  }
  .grid > .col-2 {
    grid-column: span 4;
  }
  .grid > .col-1 > * {
    max-width: clamp(40vw, min(90vw, 70ch), 95ch);
  }
  .grid#content footer {
    grid-column: span 12;
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
    page: strapiContact {
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
      MarginalColumn {
        __typename
        ... on STRAPI__COMPONENT_LAYOUT_RICH_TEXT {
          id
          marginalTxt {
            data {
              marginalTxt
            }
          }
        }
      }
    }
  }
`

ContactPage.defaultProps = {}

ContactPage.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.string,
        }),
      }),
      MarginalColumn: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
}

export const Head = ({ location, data }) => {
  const { page } = data
  return (
    <Seo
      title={page?.seo?.seo_title || `Contact`}
      attachDefault={true}
      description={page?.seo?.seo_description || null}
      image={page?.seo?.seo_image || null}
      pathname={location.pathname}
    />
  )
}

export default ContactPage
