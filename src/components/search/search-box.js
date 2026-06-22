import React, { useRef } from "react"
import { navigate } from "gatsby"
import { useSearchBox } from "react-instantsearch"

const SearchBoxInner = ({
  className,
  onFocus,
  focusBgCol,
  offCanvas,
  closeMobileNav,
}) => {
  const inputRef = useRef()
  const { query, refine } = useSearchBox()

  const handleSubmit = e => {
    e.preventDefault()

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/search"
    ) {
      navigate("/search", { replace: false, state: { query, page: 1 } })
    }
    if (offCanvas) {
      closeMobileNav()
    }
  }

  const handleChange = e => {
    refine(e.target.value)
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="relative text-gray-600 focus-within:text-gray-400">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
            aria-label="submit"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </span>
        <input
          className={`py-2 text-sm text-gray-700 bg-gray-50 border-transparent rounded-md pl-10 focus:outline-none focus:${focusBgCol} focus:text-gray-900`}
          type="text"
          placeholder="Search …"
          aria-label="Search …"
          onChange={handleChange}
          value={query}
          onFocus={onFocus}
          ref={inputRef}
        />
      </div>
    </form>
  )
}

export default SearchBoxInner
