var isBrowser = typeof window !== "undefined"

function resizeAllGridItems() {
  const grid = document.getElementById("portfolio-grid")
  if (!grid) return

  const allItems = Array.from(document.getElementsByClassName("gridItem"))

  // Read grid styles once
  const gridStyle = window.getComputedStyle(grid)
  const rowHeight = parseInt(gridStyle.getPropertyValue("grid-auto-rows"), 10)
  const rowGap = parseInt(gridStyle.getPropertyValue("row-gap"), 10)

  // Read all item heights first
  const measurements = allItems.map(item => {
    const content = item.querySelector(".gridItem-content")
    if (!content) return null

    const height = content.getBoundingClientRect().height
    const rowSpan = Math.ceil((height + rowGap) / (rowHeight + rowGap))

    return { item, rowSpan }
  })

  // Then write styles afterwards
  measurements.forEach(measurement => {
    if (!measurement) return
    measurement.item.style.gridRowEnd = `span ${measurement.rowSpan}`
  })
}

function resizeGridItem(item) {
  requestAnimationFrame(resizeAllGridItems)
}

function resizeInstance(instance) {
  const item = instance.elements[0]
  resizeGridItem(item)
}

if (isBrowser) {
  window.addEventListener("load", resizeAllGridItems)

  let resizeTimer

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)

    resizeTimer = setTimeout(() => {
      requestAnimationFrame(resizeAllGridItems)
    }, 150)
  })

  window.resizeInstance = resizeInstance
  window.resizeGridItem = resizeGridItem
}
