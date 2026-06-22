// src/components/search/SearchModal.jsx
import React, { useEffect, useRef } from "react"
import ModalSearchBox from "./modal-search-box"

export default function SearchModal({ isOpen, onClose }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    inputRef.current?.focus()

    const handleKeyDown = event => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-600/80 px-6 py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white p-4 pb-6 shadow-xl rounded"
        onClick={event => event.stopPropagation()}
      >
        <div className="mb-2 flex justify-end items-start shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none text-clr-grey-3 hover:text-clr-links focus:outline-none focus:ring-2 focus:ring-clr-grey-3"
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        <ModalSearchBox onClose={onClose} />
      </div>
    </div>
  )
}
