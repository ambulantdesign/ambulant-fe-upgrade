const striptags = require("striptags")

const aboutQuery = `{
	aboutPage: allStrapiAbout {
		edges {
			node {
				objectID: id
				title
				slug
				content {
					data {
						content
					}
				}
				internal {
          # querying internal.contentDigest is required
          contentDigest
          type
          owner
        }
			}
		}
	}
}`

const portfolioQuery = `{
	works: allStrapiWork {
		edges {
      node {
        objectID: id
        title
        slug
        content {
          data {
            content
          }
        }
        keywords {
          name
        }
				artist {
          lastname
          fullname
        }
        meta {
          medium
          info
          city
          publisher
          technical_details
          year
        }
				internal {
          # querying internal.contentDigest is required
          contentDigest
          type
          owner
        }
      }
    }
	}
}`

const indexName = `dev_ambulant-portfolio`

const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))

const entryToRecord = ({ id, ...rest }) => {
  return {
    objectId: id,
    ...rest,
  }
}

const settings = { attributesToSnippet: [`excerpt:20`] }

const queries = [
  {
    query: aboutQuery,
    transformer: ({ data }) =>
      data.aboutPage.edges.flatMap(
        ({
          node: {
            content: {
              data: { content },
            },
            slug,
            ...rest
          },
        }) => {
          const noHtml = striptags(content)
          return {
            content: noHtml,
            path: `/${slug}`,
            ...rest,
          }
        }
      ),
    indexName,
    settings,
  },
  {
    query: portfolioQuery,
    //transformer: ({ data }) => entryToAlgoliaRecord(data.works.edges),
    transformer: ({ data }) =>
      data.works.edges.flatMap(
        ({
          node: {
            content: {
              data: { content },
            },
            slug,
            ...rest
          },
        }) => {
          const noHtml = striptags(content)
          return {
            content: noHtml,
            path: `/works/${slug}`,
            ...rest,
          }
        }
      ),
    indexName,
    settings,
  },
]
module.exports = queries
