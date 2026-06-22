import * as React from "react"
import PropTypes from "prop-types"
import { useRef, useEffect } from "react"

const VideoEmbed = ({ videos }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    videoRef.current.play()
  }, [videoRef])

  return (
    <video className="video-js" preload="auto" muted={true} ref={videoRef}>
      {videos.map(videoObj => {
        const { url: src } = videoObj.localFile
        return (
          <source key={videoObj.id} src={src} type={videoObj.mime}></source>
        )
      })}
      {/* <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
			<source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source> */}
      <p className="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a
          href="https://videojs.com/html5-video-support/"
          rel="noreferrer"
          target="_blank"
        >
          supports HTML5 video
        </a>
      </p>
    </video>
  )
}

VideoEmbed.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      localFile: PropTypes.object.isRequired,
      id: PropTypes.string.isRequired,
      caption: PropTypes.string,
      mime: PropTypes.string.isRequired,
    })
  ),
}
VideoEmbed.defaultProps = {
  videos: [
    {
      localFile: {
        url: ``,
      },
      id: ``,
      caption: ``,
      mime: `video/mp4`,
    },
  ],
}

export default VideoEmbed
