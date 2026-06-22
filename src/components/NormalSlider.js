import * as React from "react"
import PropTypes from "prop-types"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import styled from "styled-components"
import VideoEmbed from "../components/VideoEmbed"

// Core modules imports are same as usual
import { Navigation, Pagination, Lazy, Keyboard } from "swiper"
// Direct React component imports
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/virtual"
import "swiper/css/lazy"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/keyboard"

const NormalSlider = ({ gallery }) => {
  // Check if window is defined (so if in the browser or in node.js).
  var isBrowser = typeof window !== "undefined"

  const transitionStartHandler = () => {
    if (isBrowser) {
      const videos = document.querySelectorAll("video")
      Array.prototype.forEach.call(videos, function (video) {
        video.pause()
      })
    }
  }
  const transitionEndHandler = swiper => {
    if (isBrowser) {
      window.autoPlayVideo(swiper.activeIndex)
    }
  }

  return (
    <>
      <Wrapper className="hero mb-12" id="slider">
        <Swiper
          modules={[Lazy, Navigation, Pagination, Keyboard]}
          spaceBetween={48}
          slidesPerView={1}
          lazy={true}
          rewind={true}
          navigation
          keyboard
          pagination={{ clickable: true }}
          onTransitionStart={() => transitionStartHandler()}
          onTransitionEnd={swiper => transitionEndHandler(swiper)}
        >
          {gallery.map((slide, index) => {
            const {
              id,
              caption = null,
              localFile = null,
              isSliderVideo = null,
              sliderVideos = null,
            } = slide
            let media = null
            if (!isSliderVideo) {
              media = getImage(localFile)
            } else {
              media = sliderVideos
            }

            if (!isSliderVideo) {
              return (
                <SwiperSlide key={id} virtualIndex={index}>
                  <GatsbyImage
                    image={media}
                    alt={caption}
                    className="swiper-lazy mb-0"
                  />
                </SwiperSlide>
              )
            } else {
              return (
                <SwiperSlide key={id} virtualIndex={index}>
                  <VideoEmbed videos={media} />
                </SwiperSlide>
              )
            }
          })}
        </Swiper>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.section`
  .swiper {
    width: 100%;
    height: 100%;
    grid-column: 2 / span 10;
  }
  .swiper .swiper-wrapper {
    max-height: 100%;
    height: 100%;
    display: flex;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .swiper-slide img,
  .swiper-slide video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .swiper .swiper-button-next,
  .swiper-button-prev {
    transition: color 0.4s ease;
  }
  .swiper .swiper-button-next:hover,
  .swiper-button-prev:hover {
    color: var(--clr-grey-4);
  }

  @media screen and (max-width: 800px) {
    .swiper {
      grid-column: span 12;
    }
  }
`

NormalSlider.defaultProps = {
  gallery: [],
}

NormalSlider.propTypes = {
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string,
      id: PropTypes.string,
      localFile: PropTypes.object,
      isSliderVideo: PropTypes.bool,
      sliderVideos: PropTypes.arrayOf(PropTypes.shape({})),
    })
  ),
}

export default NormalSlider
