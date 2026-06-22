import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { ProjectMeta } from "./ProjectMeta"
import ContentHeader from "./ContentHeader"
import RichTextContent from "./RichTextContent"
import StreamingVideo from "./StreamingVideo"
import NormalSlider from "./NormalSlider"
import WorkFooter from "./WorkFooter"
import GalleryIndicator from "./GalleryIndicator"
import RelatedGalleryProjects from "./RelatedGalleryProjects"

const WorkContentNormal = ({ data, gallery, related }) => {
  const {
    content: {
      data: { content },
    },
    artist,
    keywords,
    title,
    meta,
    weblink,
    streamingVideo,
    institution,
  } = data.work

  return (
    <Wrapper>
      <NormalSlider gallery={gallery} />

      <ContentHeader title={title} subtitle={artist?.fullname} />

      <section className="grid gap-x-0 sm:gap-10 container " id="content">
        {/* <!-- col 1 --> */}
        <div className="col-6">
          <ProjectMeta meta={meta} weblink={weblink} />
          {streamingVideo && <StreamingVideo video={streamingVideo} />}
        </div>

        {/* <!-- col 2 --> */}
        <div className="col-6">
          {content && <h5>design notes</h5>}
          <RichTextContent content={content} extraClass="description" />
        </div>
        {/* <!-- visual index (full-width)? --> */}
        {institution && (
          // own component: <VisualIndex institution={institution} work={id} />
          <div className="col-12">
            <GalleryIndicator institution={institution} />
            <RelatedGalleryProjects related={related} />
          </div>
        )}

        <WorkFooter artist={artist} keywords={keywords} />
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  p {
    margin-bottom: 1em;
  }
  .grid > .col-6 {
    grid-column: span 6;
  }
  .grid > .col-12 {
    grid-column: span 12;
  }
  .grid h5 {
    color: var(--clr-grey-3);
  }
  .grid footer h5 {
    font-weight: 400; /*X*/
    color: var(--clr-text);
    margin-bottom: 1em;
  }
  @media screen and (max-width: 640px) {
    .grid > .col-6 {
      grid-column: span 12;
    }
  }
`

WorkContentNormal.defaultProps = {
  data: {
    work: {
      title: ``,
      content: {
        data: { content: null },
      },
      meta: {
        ISBN: null,
        city: ``,
        commissioner: ``,
        format: ``,
        info: ``,
        medium: ``,
        technical_details: ``,
        year: ``,
      },
      weblink: [],
      streamingVideo: null,
      artist: {
        lastname: null,
        fullname: null,
      },
      keywords: [],
    },
  },
  gallery: [],
}

WorkContentNormal.propTypes = {
  data: PropTypes.shape({
    work: PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.string,
        }),
      }),
      meta: PropTypes.shape({
        ISBN: PropTypes.string,
        city: PropTypes.string,
        commissioner: PropTypes.string,
        format: PropTypes.string,
        info: PropTypes.string,
        medium: PropTypes.string,
        technical_details: PropTypes.string,
        year: PropTypes.string.isRequired,
      }),
      weblink: PropTypes.arrayOf(
        PropTypes.shape({
          button: PropTypes.bool.isRequired,
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }),
      ),
      streamingVideo: PropTypes.arrayOf(PropTypes.object),
      artist: PropTypes.shape({
        lastname: PropTypes.string,
        fullname: PropTypes.string,
      }),
      keywords: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }),
      ),
    }),
  }),
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string,
      id: PropTypes.string,
      localFile: PropTypes.object,
      isSliderVideo: PropTypes.bool,
      sliderVideos: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  ),
}

export default WorkContentNormal
