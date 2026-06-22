import * as React from "react"
import { useRef, useState } from "react"
import PropTypes from "prop-types"

// import useLocalStorageState from "use-local-storage-state"
import { useSafeLocalStorage } from "../hooks/use-safe-local-storage"

const CookieSwitch = ({ provider }) => {
  const { platform, cookieName } = provider
  const [streamingConsent, setStreamingConsent] = useState(false)
  // const [acceptCookies, setAcceptCookies, { removeItem }] =
  //   useLocalStorageState(cookieName, {
  //     ssr: false,
  //     defaultValue: false,
  //   })
  const [acceptCookies, setAcceptCookies, { removeItem }] = useSafeLocalStorage(
    cookieName,
    false,
  )

  const inputRef = useRef()

  const handleCheckboxChange = (cookie, checkboxVal) => {
    setStreamingConsent(checkboxVal)
    if (checkboxVal) {
      setAcceptCookies(cookie, streamingConsent)
    } else {
      removeItem()
    }
  }

  return (
    <>
      <form>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            checked={acceptCookies}
            ref={inputRef}
            className="sr-only peer"
            onChange={e => handleCheckboxChange(cookieName, e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Allow {platform} cookies
          </span>
        </label>
      </form>
    </>
  )
}

CookieSwitch.propTypes = {
  provider: PropTypes.shape({
    platform: PropTypes.string.isRequired,
    cookieName: PropTypes.string.isRequired,
  }),
}

CookieSwitch.defaultProps = {
  provider: {
    platform: ``,
    cookieName: ``,
  },
}

export default CookieSwitch
