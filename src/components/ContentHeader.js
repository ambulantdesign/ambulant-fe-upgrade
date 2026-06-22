import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

const ContentHeader = ({ title, subtitle = null, display = true }) => {
  return (
    <Wrapper className={`header ${display ? "" : "!hidden"}`}>
      <h2>{title}</h2>
      {subtitle && <h3>{subtitle}</h3>}
    </Wrapper>
  )
}

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column-reverse;
  // position: sticky;
  top: 10px;
  z-index: 90;
  background-color: var(--clr-white-opac-85);
  h3 {
    color: var(--clr-grey-3);
  }
`

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

ContentHeader.defaultProps = {
  title: ``,
  subtitle: ``,
}

export default ContentHeader
