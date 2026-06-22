import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import EmailLink from "./EMailLink"

import styled from "styled-components"

const Footer = props => {
  const { siteTitle, author, city, studioName } = props
  const currentYear = new Date().getFullYear()
  return (
    <Wrapper id="site-footer" className="grid border-t border-x-gray-300">
      <div className="logo">
        <h1>
          <span className="ambulant">
            <Link to="/" title={`Home | ambulant design`}>
              <svg
                className="circle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 339.41 323.27"
                width="20"
                height="20"
              >
                <path
                  d="m18.38,23.24c-2.52,1.86-3.57,2.71-5.83,5.37-6.3,7.38-4.29,23.17-7.19,33.86-3.07,14.22-4.06,27.95-4.44,42.52-3.17,21.27,2.22,43.21,10.45,62.94,2.04,4.77,5.48,9.25,5.24,14.94-1.32,21.43,11.35,39.97,20.6,58.31,2.98,5.73,6.94,11.1,7.98,17.69,5.17,19.08,26.1,28.61,43.18,34.9,31.18,8.08,59.21,27.42,91.86,29,36.81,3.86,68.39-15.19,101.93-25.3,41.46-11.64,48.27-41.78,57.23-78.43-.49-14.02-1.95-28.04-3.06-42.06-1.16-7.73-3.77-15.17-3.48-23.2,2.5-29.84-8.97-57.73-17.8-85.62C287.58,9.5,223.2-1.65,164.46.18c-49.06,1.99-100.17.11-145.32,22.58"
                  fill="#ce1b1c"
                  strokeWidth="0"
                />
              </svg>
            </Link>
            <Link to="/" title={`Home | ambulant design`}>
              {siteTitle}
            </Link>
          </span>
          <span className="authorName">
            <Link
              to="/about"
              title="About Gabriele Götz | ambulant design"
              aria-label={`About Gabriele Götz | ambulant design`}
            >
              {author}
            </Link>
            <span>
              {` `} — {studioName} {city}
            </span>
          </span>
        </h1>
        <div className="copyright whitespace-nowrap">
          <span>© {currentYear}</span>
        </div>
      </div>
      <div className="info imprint">
        <div className="title">Imprint</div>
        <div className="content">
          <Link
            className="bg-transparent py-4"
            to="/privacy"
            activeClassName="active"
          >
            <span className="">Privacy Policy</span>
          </Link>
        </div>
      </div>
      <div className="info email">
        <div className="title">Get in touch</div>
        <div className="content">
          <EmailLink
            encodedEmail="aW5mb0BhbWJ1bGFudGRlc2lnbi5ubA=="
            title={`Send mail to ${siteTitle}`}
            ariaLabel={`Send mail to ${siteTitle}`}
          >
            Contact me
          </EmailLink>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  padding: var(--space-20);
  padding-bottom: var(--space-margin);
  align-items: flex-start;
  column-gap: 40px;

  .logo {
    grid-column: span 6;
    column-gap: 16px;
  }
  .logo,
  .logo > h1,
  .logo > h1 span.ambulant {
    display: flex;
    flex-direction: row;
    align-items: center;
    row-gap: 0;
  }
  .logo > h1 span.ambulant {
    column-gap: 8px;
    margin-bottom: 0;
  }
  .logo > h1 {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2%;
    font-size: 1rem;
    gap: 12px;
  }
  .logo > h1 a {
    color: var(--clr-links);
    font-weight: 400;
    white-space: nowrap;
    /* margin-right: var(--space-10); */
  }
  .logo > h1 a:hover {
    color: var(--clr-grey-4);
  }
  .logo > h1 a:hover svg > path {
    fill: var(--clr-grey-4);
    background-color: var(--clr-grey-4);
    transition: all 0.4s ease;
  }

  .logo > h1 span.authorName a {
    color: var(--clr-grey-2);
    font-weight: 300;
  }
  .logo > h1 span.authorName a:hover {
    color: var(--clr-grey-4);
  }
  .logo > h1 span.authorName span {
    display: none;
  }
  .info {
    display: flex;
    grid-column: span 3;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .info .title {
    text-transform: uppercase;
    letter-spacing: 2%;
    color: var(--clr-grey-3);
  }
  .info.email {
    justify-content: flex-end;
  }
  @media screen and (max-width: 1200px) {
    .logo {
      grid-column: span 6;
    }
    .logo > h1 {
      flex-direction: row;
      align-items: center;
    }
    .logo > h1 span.ambulant {
      column-gap: 10px;
    }
    .info {
      grid-column: span 3;
    }
  }
  @media screen and (max-width: 900px) {
    margin-right: 0;
    .logo {
      grid-column: span 5;
      align-items: flex-start;
    }
    .logo > h1 {
      flex-direction: column;
      gap: 0;
      align-items: flex-start;
      width: 100%;
    }
    .logo > h1 span.authorName {
      margin-left: 30px;
    }
    .info {
      align-items: flex-start;
    }
    .imprint {
      grid-column: span 3;
    }
    .email {
      grid-column: span 4;
    }
  }
  @media screen and (max-width: 720px) {
    .logo {
      grid-column: span 12;
      align-items: center;
    }
    .logo > h1 {
      flex-direction: row;
      gap: 12px;
      align-items: center;
    }
    .logo > h1 span.authorName {
      margin-left: 0;
    }
    .imprint {
      grid-column: span 6;
    }
    .email {
      grid-column: span 6;
    }
  }
`

Footer.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  city: PropTypes.string,
  studioName: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
  author: ``,
  city: `Amsterdam`,
  studioName: `studio ambulant design`,
}

export default Footer
