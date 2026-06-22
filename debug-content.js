// debug-content.js
const React = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const ReactMarkdown = require("react-markdown").default
const rehypeRaw = require("rehype-raw").default
require("dotenv").config({ path: ".env.production" })

const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN
const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` }

async function fetchAllWorks() {
  let allWorks = []
  let page = 1
  let pageCount = 1

  do {
    const res = await fetch(
      `${STRAPI_URL}/api/works?pagination[pageSize]=100&pagination[page]=${page}&populate=*`,
      { headers },
    )
    const json = await res.json()
    allWorks = allWorks.concat(json.data)
    pageCount = json.meta?.pagination?.pageCount || 1
    page++
  } while (page <= pageCount)

  return allWorks
}

async function fetchSingleType(endpoint, populateQuery) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}${populateQuery}`, {
    headers,
  })
  const json = await res.json()
  return json.data
}

function tryRender(label, content) {
  if (!content) return null
  try {
    const element = React.createElement(ReactMarkdown, {
      children: content,
      rehypePlugins: [rehypeRaw],
    })
    renderToStaticMarkup(element)
    return null
  } catch (err) {
    return { label, error: err.message, content: content.slice(0, 300) }
  }
}

async function main() {
  const failures = []
  const allContents = []

  // 1. Works
  console.log(`Fetching works from ${STRAPI_URL} ...`)
  const works = await fetchAllWorks()
  console.log(`Got ${works.length} works.\n`)

  for (const work of works) {
    const { id, attributes } = work
    const { slug, title, content } = attributes
    if (content) {
      allContents.push(content)
      const fail = tryRender(
        `Work id=${id} slug="${slug}" title="${title}"`,
        content,
      )
      if (fail) failures.push(fail)
    }
  }

  // 2. Single types: about, contact, imprint
  const singleTypes = [
    { endpoint: "about", populate: "?populate[MarginalColumn][populate]=*" },
    { endpoint: "contact", populate: "?populate[MarginalColumn][populate]=*" },
    { endpoint: "imprint", populate: "?populate[seo][populate]=*" },
  ]

  for (const { endpoint, populate } of singleTypes) {
    console.log(`Fetching ${endpoint} ...`)
    try {
      const data = await fetchSingleType(endpoint, populate)
      const attrs = data?.attributes || {}

      // main content field
      if (attrs.content) {
        allContents.push(attrs.content)
        const fail = tryRender(`${endpoint}.content`, attrs.content)
        if (fail) failures.push(fail)
      }

      // marginalTxt inside MarginalColumn (array of components)
      const marginalColumn = attrs.MarginalColumn || []
      marginalColumn.forEach((block, idx) => {
        if (block.marginalTxt) {
          allContents.push(block.marginalTxt)
          const fail = tryRender(
            `${endpoint}.MarginalColumn[${idx}].marginalTxt`,
            block.marginalTxt,
          )
          if (fail) failures.push(fail)
        }
      })
    } catch (err) {
      console.log(`  (could not fetch/parse ${endpoint}: ${err.message})`)
    }
  }

  // 3. Report individual failures
  console.log(`\n=== INDIVIDUAL RENDER RESULTS ===`)
  if (failures.length === 0) {
    console.log(
      `✅ All ${allContents.length} individual content fields rendered successfully.`,
    )
  } else {
    failures.forEach(f => {
      console.log(`\n❌ FAILED: ${f.label}`)
      console.log(`   Error: ${f.error}`)
      console.log(`   Content: ${f.content}`)
    })
  }

  // 4. Combined render test (all on one page, like alm-list.js would)
  console.log(
    `\n=== COMBINED RENDER TEST (all ${allContents.length} contents in one tree) ===`,
  )
  try {
    const elements = allContents.map((content, idx) =>
      React.createElement(
        "div",
        { key: idx },
        React.createElement(ReactMarkdown, {
          children: content,
          rehypePlugins: [rehypeRaw],
        }),
      ),
    )
    const tree = React.createElement(React.Fragment, null, ...elements)
    renderToStaticMarkup(tree)
    console.log(`✅ Combined render succeeded.`)
  } catch (err) {
    console.log(`❌ Combined render FAILED: ${err.message}`)
    console.log(err.stack)
  }

  console.log(`\nDone.`)
}

main().catch(err => {
  console.error("Script error:", err)
  process.exit(1)
})
