import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { ProjectMeta } from "./ProjectMeta"
import ContentHeader from "./ContentHeader"
import RichTextContent from "./RichTextContent"
import ArchiveSlider from "./ArchiveSlider"
import WorkFooter from "./WorkFooter"
import GalleryIndicator from "./GalleryIndicator"
import RelatedGalleryProjects from "./RelatedGalleryProjects"

const WorkContentArchive = ({ data, gallery, related }) => {
  const {
    content: {
      data: { content = null },
    },
    artist,
    keywords,
    title,
    meta,
    weblink,
    institution,
  } = data.work

  return (
    <Wrapper>
      <ContentHeader title={title} subtitle={artist?.fullname} />

      <section className="grid gap-x-0 sm:gap-10 container " id="content">
        {/* <!-- col 1 --> */}
        <div className="col-6">
          <ArchiveSlider gallery={gallery} />
        </div>

        {/* <!-- col 2 --> */}
        <div className="col-6">
          <ProjectMeta meta={meta} />
          {content && <h5>design notes</h5>}
          <RichTextContent content={content} extraClass="description" />
          <ProjectMeta weblink={weblink} />
        </div>

        {/* <!-- visual index (full-width)? --> */}
        {institution && (
          // own component
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

WorkContentArchive.defaultProps = {
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
      artist: {
        lastname: null,
        fullname: null,
      },
      keywords: [],
    },
  },
  gallery: [],
}

WorkContentArchive.propTypes = {
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
      id: PropTypes.string.isRequired,
      localFile: PropTypes.object.isRequired,
    }),
  ),
}

export default WorkContentArchive
