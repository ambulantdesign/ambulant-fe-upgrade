/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Script, withPrefix } from "gatsby"

// import useLocalStorageState from "use-local-storage-state"
import { useSafeLocalStorage } from "../hooks/use-safe-local-storage"
import PropTypes from "prop-types"
import styled from "styled-components"

import { useSiteMetadata } from "../hooks/use-site-metadata"
import Header from "./Header"
import MainNav from "./MainNav"
import "../assets/css/layout.css"
import Footer from "./Footer"

const initialState = {
  artistNav: false,
  offCanvas: false,
}
const DEBOUNCE_TIME = 400

const defaultAppState = {
  query: "",
  page: 1,
}

const Layout = ({ id = "", currentArtistSlug = false, children }) => {
  const [isClient, setIsClient] = useState(false)
  const { title, author, city, studioName } = useSiteMetadata()
  // const [searchState, setSearchState] = useLocalStorageState("searchState", {
  //   ssr: false,
  //   defaultValue: defaultAppState,
  // })
  // const [sideNav, setSideNav] = useLocalStorageState("sideNav", {
  //   ssr: false,
  //   defaultValue: initialState,
  // })
  const [searchState, setSearchState] = useSafeLocalStorage(
    "searchState",
    defaultAppState,
  )
  const [sideNav, setSideNav] = useSafeLocalStorage("sideNav", initialState)

  const debouncedSetStateRef = useRef(null)
  const mobileNavAreaRef = useRef(null)

  useEffect(() => setIsClient(true), [])

  function onSearchStateChange(updatedSearchState) {
    // Aufruf: Search box 'onchange' (after debounce time)
    clearTimeout(debouncedSetStateRef.current)
    debouncedSetStateRef.current = setTimeout(() => {
      setSearchState(updatedSearchState)
      // updateState(updatedSearchState)
    }, DEBOUNCE_TIME)
  }

  const showMetaNavLinks = navName => {
    // setSideNav({
    //   ...sideNav,
    //   artistNav: false,
    //   [navName]: !sideNav[navName],
    // })
    setSideNav(prev => ({
      ...prev,
      artistNav: false,
      [navName]: !prev[navName],
    }))
  }
  const openMobileNav = () => {
    setSideNav(prev => ({
      ...prev,
      offCanvas: true,
    }))
    // setSideNav({ ...sideNav, offCanvas: true })
  }
  const closeMobileNav = useCallback(() => {
    setSideNav(prev => ({
      ...prev,
      offCanvas: false,
    }))
    // setSideNav({ ...sideNav, offCanvas: false })
  }, [setSideNav])

  useEffect(() => {
    if (!sideNav.offCanvas) return

    const handlePointerDown = event => {
      if (window.innerWidth >= 900) return

      if (
        mobileNavAreaRef.current &&
        !mobileNavAreaRef.current.contains(event.target)
      ) {
        closeMobileNav()
      }
    }

    const handleKeyDown = event => {
      if (window.innerWidth >= 900) return

      if (event.key === "Escape") {
        closeMobileNav()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [sideNav.offCanvas, closeMobileNav])

  return (
    <>
      <Wrapper className="site-container" id={id}>
        <>
          <Header
            siteTitle={title || `ambulant design`}
            author={author || `Gabriele Franziska Götz`}
            city={city || `Amsterdam`}
            studioName={studioName}
            openMobileNav={openMobileNav}
          />
          <div className="flex">
            <div ref={mobileNavAreaRef}>
              <MainNav
                sideNav={sideNav}
                toggleNav={showMetaNavLinks}
                currentArtistSlug={currentArtistSlug}
                closeMobileNav={closeMobileNav}
              />
            </div>
            {children}
          </div>
          <Footer
            siteTitle={title || `ambulant design`}
            author={author || `Gabriele Franziska Götz`}
            city={city || `Amsterdam`}
            studioName={studioName}
          />
        </>
      </Wrapper>

      <Script src={withPrefix("/js/functions.js")} type="text/javascript" />
      <Script
        src="https://unpkg.com/external-svg-loader@latest/svg-loader.min.js"
        type="text/javascript"
        async
      />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
}

const Wrapper = styled.div`
  .menu-icon {
    display: none;
  }
  .menu-icon a svg {
    transition: all 0.4s ease;
  }
  .menu-icon a:hover svg,
  .menu-icon a:focus svg {
    fill: var(--clr-grey-3);
    color: var(--clr-grey-3);
  }
  @media screen and (max-width: 900px) {
    .menu-icon {
      display: block;
    }
    main {
      margin-right: 0;
      width: 100%;
    }

    .slide-out {
      -webkit-transform: translate3d(-100%, 0, 0);
      -moz-transform: translate3d(-100%, 0, 0);
      -ms-transform: translate3d(-100%, 0, 0);
      -o-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
    .slide-in {
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @media screen and (max-width: 640px) {
    .grid > .col-6 {
      grid-column: span 12;
    }
  }
`

export default Layout
