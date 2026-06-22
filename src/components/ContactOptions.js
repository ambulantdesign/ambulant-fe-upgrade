import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"

import EmailLink from "./EMailLink"

import { useSiteMetadata } from "../hooks/use-site-metadata"

const ContactOptions = ({ headline, extraClass }) => {
  const { title, phone } = useSiteMetadata()
  return (
    <Wrapper className={`contact-options ${extraClass}`}>
      <div className="btn-container">
        <h4 className="mb-4">{headline}</h4>
        <p>
          <a
            className="w-full text-center bg-transparent py-2 px-4 mr-4 border rounded inline-block nav-btn"
            title={`Call ${title}`}
            href={`tel:${phone}`}
            aria-label={`Call ${title}`}
          >
            <span className="flex items-center justify-center">
              <FaPhoneAlt />
              <span className="pl-4">Phone Call</span>
            </span>
          </a>
        </p>
        <p>
          <EmailLink
            className="w-full text-center bg-transparent py-2 px-4 mr-4 border rounded inline-block nav-btn"
            encodedEmail={process.env.GATSBY_FORMIK_EMAIL_ENCODED}
            title={`Send mail to ${title}`}
            ariaLabel={`Send mail to ${title}`}
          >
            <span className="flex items-center justify-center">
              <FaEnvelope />
              <span className="pl-4">E-Mail</span>
            </span>
          </EmailLink>
        </p>
      </div>
    </Wrapper>
  )
}

export const Wrapper = styled.section`
  .nav-btn span {
    white-space: nowrap;
  }
`

ContactOptions.propTypes = {
  headline: PropTypes.string,
  extraClass: PropTypes.string,
}

ContactOptions.defaultProps = {
  headline: `Get in touch`,
  extraClass: ``,
}

export default ContactOptions
