import { getImage, getSrc } from "gatsby-plugin-image"

export const getRandomGalleryImage = gallery => {
  const index = Math.floor(Math.random() * gallery.length)
  const randomImg = getImage(gallery[index].localFile)
  return randomImg
}

export const getRandomGalleryImageSrc = gallery => {
  const index = Math.floor(Math.random() * gallery.length)
  const randomImg = getSrc(gallery[index].localFile)
  return randomImg
}

export const randomGalleryItem = gallery => {
  const index = Math.floor(Math.random() * gallery.length)
  const randomImg = gallery[index]
  return randomImg
}

export const artGalleryListOrder = (
  projects,
  institutions,
  sortOrder = "begin",
) => {
  let newProjectsList = []

  // const allInstitutions = galleries.nodes
  const galleryWorks = projects.filter(project => project.institution !== null)
  const restWorks = projects.filter(project => project.institution === null)

  let sortedInstitutions = []

  // seperate institutions within 'galleryWorks'
  institutions.forEach(institution => {
    const worksFromSingleGallery = galleryWorks.filter(
      work => work.institution.sortName === institution.sortName,
    )
    sortedInstitutions.push(...worksFromSingleGallery)
  })

  // apply new sort oder to projects array or do not change order at all
  if (sortOrder === "begin") {
    newProjectsList = [...sortedInstitutions, ...restWorks]
  } else if (sortOrder === "end") {
    newProjectsList = [...restWorks, ...sortedInstitutions]
  } else {
    newProjectsList = projects
  }

  return newProjectsList
}

export const getWorkImageUrl = work => {
  const imageFile = work?.Gallery?.[0]?.localFile
  const src = imageFile ? getSrc(imageFile) : null

  if (!src) return undefined

  return `${process.env.GATSBY_SITE_URL}${src}`
}

const seededRandom = seed => {
  let value = seed

  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

export const getRandomProjects = (
  projects,
  institutions,
  amount = 6,
  seed = 12345,
) => {
  if (!projects?.length) return []

  const random = seededRandom(seed)
  const homeProjects = [...projects]
    .map(project => ({
      project,
      sort: random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, amount)
    .map(item => item.project)
  return artGalleryListOrder(homeProjects, institutions.nodes, "end")
}
