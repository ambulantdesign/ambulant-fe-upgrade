import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import styled from "styled-components"

const NoResults = ({ tagName }) => {
  return (
    <Wrapper className="grid gap-x-0 sm:gap-10 container " id="content">
      <div className="description">
        <p>😔 Sorry, but we haven't created any content for “{tagName}” yet.</p>
        <p>Please try again later or …</p>
        <p>
          <Link
            className="text-center bg-transparent py-2.5 px-4 mr-4 border rounded nav-btn"
            to="/"
          >
            Go back home
          </Link>
        </p>
      </div>
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  .description {
    grid-column: span 12;
  }
`
NoResults.propTypes = {
  tagName: PropTypes.string.isRequired,
}

NoResults.defaultProps = {
  tagName: ``,
}

export default NoResults
