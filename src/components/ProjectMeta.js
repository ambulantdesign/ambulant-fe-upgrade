import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

export const ProjectMeta = ({ meta, weblink }) => {
  let year_end = null
  let metaData = Object.keys(meta).map(key => {
    if (String(key) === "yearEnd") {
      year_end = meta[key]
    }
    return [String(key).split("_").join(" "), meta[key]]
  })

  metaData.map(item =>
    year_end && item[0] === "year"
      ? (item[1] = `${item[1]}—${year_end}`)
      : item[1]
  )

  return (
    <Wrapper className="meta-info mb-0 sm:mb-4 ">
      {metaData.map(
        (item, key) =>
          item[1] &&
          item[0] !== "yearEnd" && (
            <div key={key}>
              <h5>{item[0]}</h5>
              <p>{item[1]}</p>
            </div>
          )
      )}
      <div className={weblink.length === 0 ? "hidden" : "btn-container"}>
        {weblink.length > 0 &&
          weblink.map((link, key) => {
            return (
              <div key={key}>
                {!link.button && <h5>www</h5>}
                <p>
                  <a
                    key={key}
                    href={link.url}
                    className={
                      link.button
                        ? "text-center bg-transparent py-2 px-4 mr-4 border rounded inline-block nav-btn"
                        : "meta txt-link"
                    }
                    title={`external link`}
                  >
                    {link.label}
                  </a>
                </p>
              </div>
            )
          })}
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  h5 {
    color: var(--clr-grey-3);
  }
`
ProjectMeta.propTypes = {
  meta: PropTypes.shape({
    ISBN: PropTypes.string,
    city: PropTypes.string,
    commissioner: PropTypes.string,
    format: PropTypes.string,
    info: PropTypes.string,
    medium: PropTypes.string,
    technical_details: PropTypes.string,
    year: PropTypes.string.isRequired,
  }),
  weblink: PropTypes.arrayOf(
    PropTypes.shape({
      button: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
}

ProjectMeta.defaultProps = {
  meta: {
    ISBN: null,
    city: ``,
    commissioner: ``,
    format: ``,
    info: ``,
    medium: ``,
    technical_details: ``,
    year: ``,
  },
  weblink: [],
}
