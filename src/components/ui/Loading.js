import * as React from "react"
import { Watch } from "react-loader-spinner"

export default function Loading({ elemId, wrapperClasses, refHandle }) {
  return (
    <div id={elemId} className={wrapperClasses} style={{}} ref={refHandle}>
      <Watch
        height="100"
        width="100"
        color="#F5F5F4"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  )
}
