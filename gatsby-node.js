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
          artist {
            slug
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

  // Werke je Künstler:in sammeln. Einzige Quelle der Wahrheit für zwei
  // Entscheidungen: die 301-Weiterleitung unten UND die Sichtbarkeit des
  // "Back to …"-Links auf der Werkseite. Beides muss zusammenpassen, sonst
  // zeigt der Link auf eine URL, die sofort wieder hierher zurückleitet.
  const workSlugsByArtist = new Map()
  resultWorks.data.works.nodes.forEach(work => {
    const artistSlug = work.artist?.slug
    if (!artistSlug || !work.slug) return
    if (!workSlugsByArtist.has(artistSlug))
      workSlugsByArtist.set(artistSlug, [])
    workSlugsByArtist.get(artistSlug).push(work.slug)
  })

  resultWorks.data.works.nodes.forEach(work => {
    const hasInstitution = Boolean(work.institution && work.institution.id)

    if (!work.slug) {
      reporter.warn(`Skipping work with missing slug: ${work.id}`)
      return
    }

    const artistSlug = work.artist?.slug
    const artistWorkCount = artistSlug
      ? (workSlugsByArtist.get(artistSlug) ?? []).length
      : 0

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
        // Bei genau einer Arbeit existiert die /artists/-Seite nicht mehr,
        // sie leitet auf genau diese Seite. Der Zurück-Link entfällt dann.
        artistHasMultipleWorks: artistWorkCount > 1,
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

    const artistWorks = workSlugsByArtist.get(artist.slug) ?? []

    // Genau eine Arbeit: die /artists/-Seite entfaellt und wird dauerhaft
    // auf die Detailseite umgeleitet. Ersetzt die frühere clientseitige
    // navigate() aus alm-list.js, die Google als Soft-Redirect wertete.
    //
    // WICHTIG — beide Flags sind noetig, und die Seite darf NICHT zusaetzlich
    // erzeugt werden:
    //   force: true            Netlify wuerde sonst eine vorhandene statische
    //                          Seite ausliefern und die Regel ignorieren.
    //   redirectInBrowser: true damit auch die interne SPA-Navigation
    //                          (MainNav, "Back to …") umleitet statt in einen
    //                          404 zu laufen.
    // Existiert fuer denselben Pfad gleichzeitig eine Seite UND ein
    // Browser-Redirect, rendert Gatsby eine leere Seite. Genau deshalb steht
    // createPage hier im else-Zweig.
    if (artistWorks.length === 1) {
      // Gatsbys Browser-Redirect vergleicht fromPath EXAKT als String
      // (gatsby/cache-dir/redirect-utils.js: redirectMap.get(pathname)),
      // ohne jede Normalisierung. Die Navigation haengt aber einen
      // abschliessenden Slash an. Ohne die Slash-Variante findet der
      // Client-Router nichts und landet im 404.
      // Deshalb beide Schreibweisen registrieren.
      const fromPaths = [`/artists/${artist.slug}`, `/artists/${artist.slug}/`]
      fromPaths.forEach(fromPath => {
        createRedirect({
          fromPath,
          toPath: `/works/${artistWorks[0]}`,
          isPermanent: true,
          force: true,
          redirectInBrowser: true,
        })
      })
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
