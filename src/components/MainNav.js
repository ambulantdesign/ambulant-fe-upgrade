import * as React from "react"
import PropTypes from "prop-types"
import { useEffect, useState, useCallback, useRef } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
// import useLocalStorageState from "use-local-storage-state"
import { useSafeLocalStorage } from "../hooks/use-safe-local-storage"

import CustomSearchBox from "../components/search/search-box"

const query = graphql`
  query {
    allStrapiArtist(sort: { lastname: ASC }) {
      nodes {
        id
        lastname
        fullname
        slug
        isInstitution
      }
    }
    allStrapiKeyword(sort: { name: ASC }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`

const MainNav = ({ sideNav, toggleNav, closeMobileNav, currentArtistSlug }) => {
  const [artistsOpen, setArtistsOpen] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return JSON.parse(localStorage.getItem("sideNav"))?.artistNav || false
    } catch {
      return false
    }
  })
  const [scrollY, setScrollY] = useSafeLocalStorage("navScrollY", 0)

  const scrollDiv = useRef(null)
  const data = useStaticQuery(query)

  const {
    allStrapiArtist: { nodes: allArtists },
    allStrapiKeyword: { nodes: allKeywords },
  } = data

  const { offCanvas } = sideNav

  const keyWordNavigation = [
    {
      id: "all",
      name: "All",
      slug: "all",
      path: "/works/",
    },
    ...allKeywords.map(keyword => ({
      ...keyword,
      path: `/keywords/${keyword.slug}/`,
    })),
  ]

  const ChevronIcon = ({ open }) => (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-3 w-3 transition-transform duration-300 ease-out ${
        open ? "rotate-90" : "rotate-0"
      }`}
    >
      <path
        d="M7.5 4.5L12.5 10L7.5 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const handleBtnClick = state => {
    toggleNav("artistNav")
    setArtistsOpen(state)
  }

  const handleOnScroll = useCallback(
    e => {
      setScrollY(e.target.scrollTop)
    },
    [setScrollY],
  )

  useEffect(() => {
    const div = scrollDiv.current
    // subscribe event
    div.addEventListener("scroll", handleOnScroll)
    return () => {
      // unsubscribe event
      div.removeEventListener("scroll", handleOnScroll)
    }
  }, [scrollDiv, handleOnScroll])

  useEffect(() => {
    // console.log("set scrollTop to " + scrollY)
    scrollDiv.current.scrollTop = scrollY
  }, [scrollY])

  return (
    <>
      {/* Assign CSS classes 'slide-out' oder 'slide-in' depepending on value of 'offCanvas' state variable > Maybe everything inside the 'Layout' component (higher level)  */}
      <Wrapper
        className={`gfgSideNav ${offCanvas ? "slide-in" : "slide-out"}`}
        id="gfgSideNav"
        ref={scrollDiv}
      >
        <div className="menu-icon">
          {/* <!-- Please refer: https://github.com/shubhamjain/svg-loader --> */}
          <button
            type="button"
            onClick={closeMobileNav}
            aria-label="close menu"
          >
            <svg
              data-src="/hero-outline.svg?ic=x"
              width="48"
              height="48"
              color="#ce1b1c"
            ></svg>
          </button>
        </div>
        <nav className="w-full px-5">
          <div className="form-field">
            <CustomSearchBox
              focusBgCol="bg-white"
              closeMobileNav={closeMobileNav}
            />
          </div>
          <ul className="list-none ml-0 taxonomy-nav">
            <li>
              <ul className="list-none ml-0 keywords">
                {keyWordNavigation.map(keyword => {
                  const { id, name, path } = keyword
                  return (
                    <li key={id}>
                      <Link
                        className="bg-transparent block w-full"
                        to={path}
                        activeClassName="active"
                        onClick={closeMobileNav}
                      >
                        {name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleBtnClick(value => !value)}
                aria-label="Artists"
                aria-expanded={artistsOpen}
                aria-controls="artists-list"
                className={`flex w-full items-center justify-between text-left transition-colors duration-200 hover:text-clr-grey-3 ${
                  artistsOpen ? "text-clr-links" : ""
                }`}
              >
                <span>Artists</span>
                <ChevronIcon open={artistsOpen} />
              </button>
              <div
                id="artists-list"
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  artistsOpen
                    ? "mt-4 max-h-full opacity-100 translate-y-0"
                    : "mt-0 max-h-0 opacity-0 -translate-y-1"
                }`}
              >
                <ul className="artists list-none ml-0 mb-4 p-0 normal-case tracking-normal">
                  {allArtists.map(artist => {
                    const { id, fullname, slug, isInstitution } = artist
                    if (isInstitution) return null
                    return (
                      <li key={id} className="relative pl-5">
                        <Link
                          className="bg-transparent py-4"
                          to={`/artists/${slug}`}
                          activeClassName="active"
                          onClick={closeMobileNav}
                          getProps={({ isCurrent }) => ({
                            className:
                              isCurrent || currentArtistSlug === slug
                                ? "bg-transparent py-4 active"
                                : "bg-transparent py-4",
                          })}
                        >
                          {fullname}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // position: absolute;
  // z-index: 101;
  /* position: absolute; */
  width: var(--nav-lg-width);
  background-color: white;
  transition-duration: 0.44s;
  transition-property: transform;
  -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);

  nav > ul {
    padding-top: var(--space-20);
  }

  nav .taxonomy-nav ul.artists li::before {
    content: "›";
    position: absolute;
    left: 0;
    top: -0.25rem;
    color: currentColor;
    font-size: 1.25rem;
    line-height: inherit;
    transition:
      color 250ms ease,
      transform 250ms ease;
  }
  nav .taxonomy-nav ul.artists li:hover::before {
    transform: translateX(0.15rem);
    color: var(--clr-links);
  }

  nav .taxonomy-nav .nav-btn.show-nav + ul {
    max-height: 100%;
    transition: max-height 0.5s ease-in-out;
  }
  nav .taxonomy-nav .nav-btn.show-nav + ul li {
    opacity: 100%;
  }
  nav .taxonomy-nav li > a.nav-btn.show-nav {
    color: var(--clr-links);
    border-color: var(--clr-links);
  }
  nav .list-none li > a,
  nav .list-none li > button {
    cursor: pointer;
  }
  .menu-icon a svg,
  .menu-icon button svg {
    transition: all 0.4s ease;
  }
  .menu-icon button:hover svg,
  .menu-icon button:focus svg {
    fill: var(--clr-grey-3);
    color: var(--clr-grey-3);
  }
  .form-field {
    display: none;
  }
  @media screen and (max-width: 900px) {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    -webkit-backface-visibility: hidden;
    width: var(--nav-lg-width);
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 199;
    -webkit-box-shadow:
      rgba(10, 10, 10, 0.15) 2.4px 2.4px 3.2px,
      0 0 0 1px rgba(10, 10, 10, 0.02);
    box-shadow:
      rgba(10, 10, 10, 0.15) 2.4px 2.4px 3.2px,
      0 0 0 1px rgba(10, 10, 10, 0.02);
    nav {
      margin-top: var(--space-3);
    }
    .menu-icon {
      align-self: end;
    }
  }
  @media screen and (max-width: 640px) {
    nav {
      margin-top: var(--space-3);
    }
    nav .form-field {
      display: block;
    }
  }
`

MainNav.propTypes = {
  sideNav: PropTypes.shape({
    artistNav: PropTypes.bool,
    offCanvas: PropTypes.bool,
  }),
  toggleNav: PropTypes.func.isRequired,
  closeMobileNav: PropTypes.func.isRequired,
}

MainNav.defaultProps = {
  sideNav: {
    artistNav: false,
    offCanvas: false,
  },
  toggleNav: () => {},
  closeMobileNav: () => {},
}

export default MainNav
