import * as React from "react"
import PropTypes from "prop-types"
import { useRef, useEffect, useState, useCallback } from "react"
import { getSrc } from "gatsby-plugin-image"

/**
 * Autoplay-Regeln der Browser:
 *  - autoplay funktioniert NUR stummgeschaltet
 *  - iOS braucht zusaetzlich playsinline, sonst kein Inline-Playback
 *  - iOS Low Power Mode und Android Data Saver blockieren trotzdem
 *    -> deshalb der Fallback-Button
 *
 * React-Fallstrick: `muted` wird von React NICHT ins SSR-HTML geschrieben
 * (React-Issue #10389). Gatsby liefert statisches HTML aus, das Video ist vor
 * der Hydration also nicht stumm und der Autostart wird blockiert - auf Safari
 * und iOS dauerhaft. Deshalb setzen wir muted/defaultMuted im ref-Callback,
 * der beim Hydrate frueher laeuft als useEffect.
 *
 * `preload="auto"` ist hier unbedenklich: work-details.js fasst alle
 * addToSlider-Videos zu EINER Slide zusammen, es gibt also genau ein
 * <video> pro Seite.
 */
const VideoEmbed = ({ videos, poster }) => {
  const videoRef = useRef(null)
  const [needsGesture, setNeedsGesture] = useState(false)

  const posterSrc = poster?.localFile ? getSrc(poster.localFile) : null

  const attachRef = useCallback(node => {
    videoRef.current = node
    if (node) {
      node.muted = true
      node.defaultMuted = true
    }
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    el.muted = true

    const attempt = () => {
      const p = el.play()
      if (p && typeof p.catch === "function") {
        p.then(() => setNeedsGesture(false)).catch(() => setNeedsGesture(true))
      }
    }
    const fail = () => setNeedsGesture(true)

    if (el.readyState >= 2) {
      attempt()
    } else {
      el.addEventListener("loadeddata", attempt, { once: true })
      el.addEventListener("error", fail, { once: true })
    }

    return () => {
      el.removeEventListener("loadeddata", attempt)
      el.removeEventListener("error", fail)
    }
  }, [])

  const handleManualPlay = () => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    const p = el.play()
    if (p && typeof p.catch === "function") {
      p.then(() => setNeedsGesture(false)).catch(() => {})
    }
  }

  // Das WebM war bei 480p groesser als das MP4 - MP4 bevorzugen.
  // Nur wenn gar kein MP4 vorhanden ist, alles durchreichen.
  const mp4Only = videos.filter(v => v.mime === "video/mp4")
  const sources = mp4Only.length > 0 ? mp4Only : videos

  return (
    <div className="video-embed">
      <video
        ref={attachRef}
        className="video-js"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={posterSrc || undefined}
      >
        {sources.map(videoObj => (
          <source
            key={videoObj.id}
            src={videoObj.localFile.url}
            type={videoObj.mime}
          />
        ))}
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a
            href="https://videojs.com/html5-video-support/"
            rel="noreferrer"
            target="_blank"
          >
            supports HTML5 video
          </a>
        </p>
      </video>

      {needsGesture && (
        <button
          type="button"
          className="video-embed__play"
          onClick={handleManualPlay}
          aria-label="Play video"
        >
          <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
            <path
              d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.8 0 34 0 34 0S12.2 0 7.5 1.7a8.6 8.6 0 0 0-6 6A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.2 48 34 48 34 48s21.8 0 26.5-1.7a8.6 8.6 0 0 0 6-6A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z"
              fill="currentColor"
              opacity="0.75"
            />
            <path d="M45 24 27 14v20z" fill="#fff" />
          </svg>
        </button>
      )}
    </div>
  )
}

VideoEmbed.propTypes = {
  poster: PropTypes.shape({ localFile: PropTypes.object }),
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      localFile: PropTypes.object.isRequired,
      id: PropTypes.string.isRequired,
      caption: PropTypes.string,
      mime: PropTypes.string.isRequired,
    }),
  ),
}

VideoEmbed.defaultProps = {
  poster: null,
  videos: [
    {
      localFile: { url: `` },
      id: ``,
      caption: ``,
      mime: `video/mp4`,
    },
  ],
}

export default VideoEmbed
