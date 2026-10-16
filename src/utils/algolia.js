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

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

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

// Index-Einstellungen, die gatsby-plugin-algolia bei jedem Build auf `main`
// an Algolia uebertraegt. Muessen mit dem Algolia-Dashboard uebereinstimmen,
// sonst ueberschreibt der Build die Dashboard-Werte.
const settings = {
  attributesToSnippet: [`excerpt:20`],
  // Jahreszahlen exakt: "2010" findet nicht mehr 2011, 2000 usw.
  // Woerter bleiben fehlertolerant. (Im Dashboard seit 16.10.2026 gesetzt.)
  allowTyposOnNumericTokens: false,
  // Spiegel der Dashboard-Liste (Stand 16.10.2026). Reihenfolge = Gewichtung.
  // Ohne unordered() = "ordered" (Position im Feld zaehlt).
  searchableAttributes: [
    `title`,
    `unordered(content)`,
    `meta.year`,
    `unordered(meta.city)`,
    `unordered(meta.info)`,
    `unordered(meta.medium)`,
    `unordered(meta.publisher)`,
    `unordered(meta.technical_details)`,
    `unordered(artist.fullname)`,
    `unordered(artist.lastname)`,
  ],
}

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
        },
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
        },
      ),
    indexName,
    settings,
  },
]
module.exports = queries
