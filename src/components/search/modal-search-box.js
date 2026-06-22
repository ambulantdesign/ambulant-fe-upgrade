// src/components/search/modal-search-box.js
import React, { useEffect, useRef, useState } from "react"
import { Link } from "gatsby"
import { useSearchBox, useHits } from "react-instantsearch"

function ModalSearchInput({ inputRef }) {
  const { query, refine } = useSearchBox()

  return (
    <div className="relative text-gray-600 shrink-0">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={event => refine(event.currentTarget.value)}
        placeholder="Search …"
        aria-label="Search …"
        autoComplete="off"
        spellCheck="false"
        className="w-full py-2 pl-10 text-lg bg-gray-50 border-transparent rounded-md outline-none focus:bg-stone-100"
      />
    </div>
  )
}

function ModalSearchResults({ activeIndex, onHitClick }) {
  const { query } = useSearchBox()
  const { hits, results } = useHits()
  const hitCount = results?.nbHits ?? 0

  if (query.length === 0) return null

  if (hitCount === 0) {
    return (
      <div className="py-8 text-center text-lg text-clr-grey-3 shrink-0">
        Nothing found for "{query}".
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col overflow-y-auto">
      <div>
        <div className="hit-count pb-2">
          {hitCount} result{hitCount !== 1 ? `s` : ``}
        </div>
        <hr />
      </div>
      <ul>
        {hits.map((hit, index) => (
          <li key={hit.objectID}>
            <Link
              to={hit.path}
              onClick={onHitClick}
              data-result-index={index}
              className={`block w-full text-left rounded-md px-3 py-3 transition-colors cursor-pointer hover:bg-stone-100 focus:bg-stone-100 outline-none ${
                index === activeIndex ? "bg-stone-100" : ""
              }`}
            >
              <span className="block text-lg font-medium">{hit.title}</span>
              {hit.artist?.fullname && (
                <span className="block text-base text-clr-grey-3">
                  {hit.artist.fullname}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ViewAllResultsLink({ onHitClick }) {
  const { query } = useSearchBox()

  if (query.length === 0) return null

  return (
    <div className="mt-3 border-t border-stone-200 pt-3 shrink-0">
      <Link
        to={`/search/?q=${encodeURIComponent(query)}`}
        onClick={onHitClick}
        className="block w-full text-center rounded-md px-3 py-2 text-lg text-clr-links hover:bg-stone-100"
      >
        View all results for "{query}" →
      </Link>
    </div>
  )
}

export default function ModalSearchBox({ onClose }) {
  const inputRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = event => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex(i => i + 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (event.key === "Enter" && activeIndex >= 0) {
      document.querySelector(`[data-result-index="${activeIndex}"]`)?.click()
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="flex flex-col min-h-0 flex-1">
      <ModalSearchInput inputRef={inputRef} />
      <ModalSearchResults activeIndex={activeIndex} onHitClick={onClose} />
      <ViewAllResultsLink onHitClick={onClose} />
    </div>
  )
}
