const path = require("path")

// create pages dynamically
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions
  const resultWorks = await graphql(`
    query Projects {
      works: allStrapiWork {
        nodes {
          slug
          institution {
            id
          }
        }
      }
    }
  `)
  const resultArtists = await graphql(`
    query Artitsts {
      artists: allStrapiArtist {
        nodes {
          slug
          fullname
          isInstitution
        }
      }
    }
  `)
  const resultKeywords = await graphql(`
    query Keywords {
      keywords: allStrapiKeyword {
        nodes {
          slug
          name
        }
      }
    }
  `)

  resultWorks.data.works.nodes.forEach(work => {
    const hasInstitution = Boolean(work.institution && work.institution.id)

    if (!work.slug) {
      reporter.warn(`Skipping work with missing slug: ${work.id}`)
      return
    }

    // Always create the page, even if institution is missing
    createPage({
      path: `/works/${work.slug}`,
      component: path.resolve(`src/templates/work-details.js`),
      context: {
        slug: work.slug,
        // Ensure hasInstitution is always boolean
        hasInstitution,
        // Only pass a valid filter if institution exists
        filter: hasInstitution ? { id: { eq: work.institution.id } } : null, // war: undefined
      },
      defer: false,
    })
  })

  resultArtists.data.artists.nodes.forEach(artist => {
    // Institutionen (Galerien etc.) bekommen keine eigene /artists/-Seite,
    // da sie keine eigenen Werke haben und im Frontend ohnehin
    // aus der Navigation ausgeblendet werden (siehe MainNav.js)
    if (artist.isInstitution) {
      return
    }

    createPage({
      path: `/artists/${artist.slug}`,
      component: path.resolve(`src/templates/alm-list.js`),
      context: {
        slug: artist.slug,
        title: artist.fullname,
        contentType: "artists",
      },
      defer: false,
    })
  })

  resultKeywords.data.keywords.nodes.forEach(keyword => {
    createPage({
      path: `/keywords/${keyword.slug}`,
      component: path.resolve(`src/templates/alm-list.js`),
      context: {
        slug: keyword.slug,
        title: keyword.name,
        contentType: "keywords",
      },
      defer: false, // Defer page generation to the first user request? (DSG)
    })
  })
  createRedirect({
    fromPath: `/gabriele-goetz`,
    toPath: `/about`,
  })
  createRedirect({
    fromPath: `/tag/artist`,
    toPath: `/artists/holger-bunk`,
  })
  createRedirect({
    fromPath: `/tag/publisher`,
    toPath: `/`,
  })
  createRedirect({
    fromPath: `/tag/*`,
    toPath: `/keywords/*`,
  })
  createRedirect({
    fromPath: `/:id`,
    toPath: `/`,
  })
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    StrapiWork: {
      institutionSortName: {
        type: "String",
        resolve: source => source.institution?.sortName || "",
      },
    },
  })
}
