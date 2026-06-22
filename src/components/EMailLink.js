import React from "react"

const EmailLink = ({
  encodedEmail,
  children,
  title = "",
  ariaLabel = "",
  className = "",
  subject = "",
}) => {
  const handleClick = e => {
    e.preventDefault()

    const email = atob(encodedEmail)

    const mailto = subject
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${email}`

    window.location.href = mailto
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}

export default EmailLink
