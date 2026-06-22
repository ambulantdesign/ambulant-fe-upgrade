import * as React from "react"
import PropTypes from "prop-types"
import { useState, useRef } from "react"
import styled from "styled-components"
// import useLocalStorageState from "use-local-storage-state"
import { useSafeLocalStorage } from "../hooks/use-safe-local-storage"

import RichTextContent from "./RichTextContent"
import Video from "./Video"
import { useHasMounted } from "../hooks/useHasMounted"

const StreamingVideo = ({ video }) => {
  const inputRef = useRef()
  const {
    consent_message: {
      data: { consent_message },
    },
  } = video

  const cookieName = `accept${video.streamingPlatform}Cookies`

  const [streamingConsent, setStreamingConsent] = useState(false)
  // const [acceptCookies, setAcceptCookies, { removeItem }] =
  //   useLocalStorageState(cookieName, {
  //     ssr: false,
  //     defaultValue: false,
  //   })

  const [acceptCookies, setAcceptCookies, { removeItem }] = useSafeLocalStorage(
    cookieName,
    false,
  )

  const handleSubmit = e => {
    e.preventDefault()
    removeItem()
    setAcceptCookies(cookieName, streamingConsent)
  }

  const handleCheckboxChange = checkboxVal => {
    setStreamingConsent(checkboxVal)
  }

  return (
    <Wrapper id="videoContainer">
      {useHasMounted &&
        (!acceptCookies ? (
          <div className="yt-consent py-2 px-4 border-transparent rounded">
            <RichTextContent
              content={consent_message}
              extraClass="consent-message"
            />
            <form onSubmit={handleSubmit}>
              <label htmlFor="yt-consent" className="inline-flex items-top">
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6"
                  name="yt-consent"
                  id="yt-consent"
                  ref={inputRef}
                  value={streamingConsent}
                  onChange={e => handleCheckboxChange(e.target.checked)}
                />
                <span className="ml-2">
                  Yes, I am fine with cookies from {video.streamingPlatform}.
                </span>
              </label>
              <button
                type="submit"
                disabled={!streamingConsent}
                className="submit text-center btn-solid py-2 px-4 mt-2 mb-4 border rounded block disabled:opacity-50"
              >
                {streamingConsent ? "Watch video now" : "Video blocked"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <h3>{video.videoCaption}</h3>
            <Video
              videoId={video.videoId}
              videoServerUrl={video.url}
              urlParams={video.urlParams !== null ? video.urlParams : ""}
              videoTitle={video.videoCaption}
            />
          </>
        ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: var(--space-5);
  .yt-consent {
    background-color: var(--clr-sand);
  }
  .consent-message h4 {
    margin-bottom: var(--space-3);
  }
  .submit {
    &:disabled {
      box-shadow: none;
      &:hover,
      &:focus {
        cursor: not-allowed;
        background-color: var(--clr-grey-9);
        color: var(--clr-white);
        border: 1px solid transparent;
      }
    }
  }
`

StreamingVideo.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string,
    autoplay: PropTypes.bool,
    consent_message: PropTypes.shape({
      data: PropTypes.shape({
        consent_message: PropTypes.string,
      }),
    }),
    controls: PropTypes.bool,
    loop: PropTypes.bool,
    related: PropTypes.bool,
    show_fullscreen: PropTypes.bool,
    streamingPlatform: PropTypes.string,
    url: PropTypes.string,
    urlParams: PropTypes.string,
    videoCaption: PropTypes.string,
    videoId: PropTypes.string,
    __typename: PropTypes.string,
  }),
}

StreamingVideo.defaultProps = {
  video: {
    id: ``,
    autoplay: false,
    consent_message: {
      data: {
        consent_message: ``,
      },
    },
    controls: false,
    loop: false,
    related: false,
    show_fullscreen: false,
    streamingPlatform: ``,
    url: ``,
    urlParams: ``,
    videoCaption: ``,
    videoId: ``,
    __typename: `STRAPI__COMPONENT_MEDIA_STREAMING_VIDEO`,
  },
}

export default StreamingVideo
