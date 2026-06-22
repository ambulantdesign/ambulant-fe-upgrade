import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"

const WorkFooter = ({ artist, keywords }) => {
  return (
    <Wrapper className="my-10">
      <h5>related works</h5>
      <div className="btn-container">
        {artist?.fullname && (
          <Link
            className="text-center bg-transparent py-2 px-4 mr-4 border rounded inline-block nav-btn"
            to={`/artists/${artist.slug}`}
          >
            <span className="">{artist.fullname}</span>
          </Link>
        )}
        {keywords.map(keyword => (
          <Link
            className="text-center bg-transparent py-2 px-4 mr-4 mb-4 border rounded inline-block nav-btn"
            to={`/keywords/${keyword.slug}`}
            key={keyword.id}
          >
            <span className="">{keyword.name}</span>
          </Link>
        ))}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  grid-column: span 12;

  h5 {
    font-weight: 400; /*X*/
    color: var(--clr-text);
    margin-bottom: 1em;
  }
`

WorkFooter.defaultProps = {
  artist: {
    lastname: null,
    fullname: null,
  },
  keywords: [],
}

WorkFooter.propTypes = {
  artist: PropTypes.shape({
    lastname: PropTypes.string,
    fullname: PropTypes.string,
  }),
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ),
}

export default WorkFooter
