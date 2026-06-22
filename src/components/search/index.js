import React from "react"
import { Link } from "gatsby"
import { useHits, useSearchBox, Highlight } from "react-instantsearch"

export default function CustomSearch() {
  const { hits, results } = useHits()
  const { query } = useSearchBox()
  const hitCount = results?.nbHits ?? 0

  if (hitCount === 0) {
    return (
      <>
        <div className="hit-count">0 results</div>
        <hr />
        <div className="ais-Hits">
          <p>😔 Sorry, nothing found for "{query}".</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="hit-count">
        {hitCount} result{hitCount !== 1 ? `s` : ``}
      </div>
      <hr />
      <ul className="Hits">
        {hits.map(hit => (
          <li key={hit.objectID}>
            <Link to={hit.path}>
              <article>
                <h2>
                  <Highlight attribute="title" hit={hit} />
                </h2>
                {hit.artist?.fullname && (
                  <h5 className="pr-4">{hit.artist.fullname}</h5>
                )}
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
