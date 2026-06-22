import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"

import GalleryIndicator from "./GalleryIndicator"
import { getRandomGalleryImage } from "../utils/gallery-helper"

const GridProject = ({ id, title, slug, artist, gallery, institution }) => {
  const randomImg = getRandomGalleryImage(gallery)

  // Check if window is defined (so if in the browser or in node.js).
  var isBrowser = typeof window !== "undefined"

  const gridItemHandler = item => {
    if (isBrowser) {
      window.resizeGridItem(document.getElementById(item))
    }
  }

  return (
    <Wrapper className="gridItem-content">
      <Link
        to={`/works/${slug}`}
        aria-label={`${artist?.fullname + ": " || ""} ${title || ""}`}
        className="group relative block overflow-hidden"
      >
        <GatsbyImage
          image={randomImg}
          alt={`${artist?.fullname + ": " || ""} ${title || ""}`}
          className="block mb-0"
          onLoad={() => gridItemHandler(`gridItem-${id}`)}
        />
        {/* HOVER OVERLAY */}
        <div
          className="
          absolute inset-0
          opacity-0
          transition-opacity
          duration-300
          ease-out
          group-hover:opacity-100
          group-focus-visible:opacity-100
        "
        >
          {/* CUSTOM GRADIENT */}
          <div
            className="
            absolute inset-0
            bg-gradient-to-t
          from-white/100
					via-white/65
					to-transparent
          "
          />

          {/* TEXT CONTENT */}
          <div
            className="textContent 
            absolute
            bottom-0
            left-0
            z-10
            w-full
            p-4
          "
          >
            {artist?.fullname && <h5 className="pr-4">{artist.fullname}</h5>}
            {title && <h4 className="pr-4">{title}</h4>}
            {institution && <GalleryIndicator institution={institution} />}
          </div>
        </div>
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled.figure`
  display: flex;
  justify-content: center;
  margin-bottom: 0;
  a {
    display: inline-block;
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
  a:active .textContent h4,
  a:hover .textContent h4 {
    color: var(--clr-text);
  }
  a:active .textContent h5,
  a:hover .textContent h5 {
    color: var(--clr-grey-2);
  }
  a.stoned {
    transition: background-color 0.4s ease;
  }
  a.stoned:hover {
    background-color: var(--clr-stone);
  }
  a img {
    max-height: 300px;
  }
`

GridProject.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
  artist: PropTypes.object,
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      localFile: PropTypes.object.isRequired,
      id: PropTypes.string.isRequired,
      caption: PropTypes.string,
    }),
  ),
  institution: PropTypes.object,
}

GridProject.defaultProps = {
  id: ``,
  title: `de`,
  slug: ``,
  artist: {},
  gallery: [
    {
      localFile: {},
      id: "0",
      caption: ``,
    },
  ],
  institution: null,
}
export default GridProject
