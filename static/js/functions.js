// Check if window is defined (so if in the browser or in node.js).
var isBrowser = typeof window !== "undefined"

/* slide-in side navigation from the right */
function openNav(e) {
  e.preventDefault()
  document.querySelector(".gfgSideNav").style.width = "200px"
}

/* slide-out side navigation to the right (off canvas) */
function closeNav(e) {
  e.preventDefault()
  document.querySelector(".gfgSideNav").style.width = "0"
}

if (isBrowser) {
  // Check if device does support 'orientationchange' event
  // if not: use 'resize' event for fallback
  let supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange
      ? "orientationchange"
      : "resize"

  window.addEventListener(
    orientationEvent,
    function () {
      document.querySelector(".gfgSideNav").style = ""
    },
    false,
  )
  window.openNav = openNav
  window.closeNav = closeNav
}
