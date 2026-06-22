import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const GalleryIndicator = ({ institution }) => {
  return (
    <Wrapper className="institution">
      <span
        className="dot"
        style={{ backgroundColor: `${institution.colorCode}` }}
      ></span>
      <span
        className="galleryName"
        style={{ color: `${institution.colorCode}` }}
      >
        {institution.name}
      </span>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 0.4rem;

  span.galleryName {
    display: inline-block;
    /* border-radius: 50%;
    width: 10px;
    height: 10px; */
  }
  span.dot {
    display: inline-block;
    border-radius: 50%;
    width: 0.5rem;
    height: 0.5rem;
  }
`
GalleryIndicator.propTypes = {
  institution: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sortName: PropTypes.string,
    colorCode: PropTypes.string.isRequired,
  }),
}
export default GalleryIndicator
