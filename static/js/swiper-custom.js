// WICHTIG: diese Zeile fehlte bisher als einzige in static/js/.
// Ohne sie wirft die Datei einen ReferenceError, sobald functions.js
// nicht zufaellig vorher geladen wurde und `isBrowser` global gesetzt hat.
var isBrowser = typeof window !== "undefined"

function autoPlayVideo(activeIndex) {
  var slides = document.getElementsByClassName("swiper-slide")
  var activeSlide = slides[activeIndex]
  if (!activeSlide) return

  var video = activeSlide.getElementsByTagName("video")[0]
  if (!video) return

  // Autoplay ist nur stumm erlaubt
  video.muted = true

  var p = video.play()
  if (p && typeof p.catch === "function") {
    p.catch(function () {
      // Browser hat abgelehnt (z.B. iOS Low Power Mode) - kein Absturz,
      // der Fallback-Button in VideoEmbed uebernimmt.
    })
  }
}

if (isBrowser) {
  window.autoPlayVideo = autoPlayVideo
}
