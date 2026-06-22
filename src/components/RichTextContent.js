// import * as React from "react"

// import ReactMarkdown from "react-markdown"
// import rehypeRaw from "rehype-raw"

// const RichTextContent = ({ content, extraClass = "" }) => {
//   return (
//     <div className={extraClass}>
//       <ReactMarkdown children={content} rehypePlugins={[rehypeRaw]} />
//     </div>
//   )
// }

// export default RichTextContent

// src/components/RichTextContent.js
import * as React from "react"
import { parse, serialize } from "parse5"

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

// Repariert fehlerhaftes/nicht wohlgeformtes HTML (z.B. nicht geschlossene Tags),
// indem es über einen vollständigen HTML-Parse-Zyklus normalisiert wird.
const sanitizeHtml = html => {
  if (!html) return ""
  try {
    const fragment = parse(`<div>${html}</div>`)
    const body = fragment.childNodes[0]?.childNodes?.[1] // html > body
    const div = body?.childNodes?.find(node => node.tagName === "div")
    return div ? serialize(div).replace(/^<div>|<\/div>$/g, "") : html
  } catch {
    return html
  }
}

const RichTextContent = ({ content, extraClass = "" }) => {
  const safeContent = sanitizeHtml(content)

  return (
    <div className={extraClass}>
      <ReactMarkdown children={safeContent} rehypePlugins={[rehypeRaw]} />
    </div>
  )
}

export default RichTextContent
