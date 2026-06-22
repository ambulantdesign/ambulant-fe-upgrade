import * as React from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"

import { getRandomGalleryImage } from "../utils/gallery-helper"

const RelatedGalleryProjects = ({ related }) => {
  return (
    <Wrapper className="grid">
      {related.map(project => {
        const { id, slug, title, Gallery } = project
        const randomImg = getRandomGalleryImage(Gallery)
        return (
          <div key={id} className="project">
            <Link to={`/works/${slug}`} title={title}>
              <GatsbyImage image={randomImg} alt={title} className="mb-4" />
            </Link>
          </div>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin-top: 1rem;
  display: grid;
  align-items: start;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  .project {
    padding: 0 2px;
    height: auto;
    max-height: 100px;
  }
  a img {
    border-top: 3px solid transparent;
    background-color: transparent;
    transition: border-color 0.4s ease;
  }
  a:active img,
  a:hover img {
    border-color: var(--clr-links);
  }
  p {
    margin-bottom: 1em;
  }
  .grid > .col-6 {
    grid-column: span 6;
  }
  .grid > .col-12 {
    grid-column: span 12;
  }
  .grid h5 {
    color: var(--clr-grey-3);
  }
  .grid footer h5 {
    font-weight: 400; /*X*/
    color: var(--clr-text);
    margin-bottom: 1em;
  }
  @media screen and (max-width: 640px) {
    .grid > .col-6 {
      grid-column: span 12;
    }
  }
`

export default RelatedGalleryProjects
