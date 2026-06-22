import * as React from "react"
import { useRef, useEffect, useState } from "react"

import { useFormik } from "formik"
import * as Yup from "yup"
import emailjs from "@emailjs/browser"
import styled from "styled-components"
import { Oval } from "react-loader-spinner"

const CONTACT_ERROR = {
  success: "Your message has been successfully sent to ambulant design.",
  error: "Something went wrong, please try again later.",
}

const alertInitial = {
  type: "",
  msg: "",
}

const validationSchema = Yup.object({
  from_name: Yup.string()
    .min(3, "Your name is too short")
    .required("Please enter your name"),
  subject: Yup.string()
    .min(5, "The subject is too short")
    .required("Please enter a subject"),
  reply_to: Yup.string()
    .email("Invalid email address")
    .required("Please enter your email"),
  message: Yup.string()
    .min(10, "Your message is too short")
    .required("Please enter your message"),
})

const ContactForm = () => {
  const [alert, setAlert] = useState(alertInitial)
  const [fadeProp, setFadeProp] = useState({
    fade: "",
  })
  const contactForm = useRef()

  useEffect(
    () =>
      emailjs.init({
        publicKey: process.env.GATSBY_FORMIK_USER_ID,
        // Do not allow headless browsers
        blockHeadless: true,
      }),
    []
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (alert.type !== "") {
        setFadeProp({
          fade: "fade-out",
        })
      }
    }, 3500)
    return () => {
      clearTimeout(timeout)
    }
  }, [alert, setFadeProp])

  const formik = useFormik({
    //we have created our initailValues object in a format EmailJS accepts
    initialValues: {
      from_name: "", //user name
      to_name: process.env.GATSBY_FORMIK_EMAIL, //email id of the admin
      subject: "", // subject of email
      reply_to: "", // user email
      message: "", // message of email
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      // Email JS code will go here
      emailjs
        .send(
          process.env.GATSBY_FORMIK_SERVICE_ID,
          process.env.GATSBY_FORMIK_TEMPLATE_ID,
          values,
          process.env.GATSBY_FORMIK_USER_ID
        )
        .then(result => {
          // navigate("/about")
          setAlert({ type: "alert-success", msg: CONTACT_ERROR.success })
        })
        .catch(() => error => {
          console.log(error.text)
          setAlert({ type: "alert-error", msg: CONTACT_ERROR.error })
          // sentMessage.current.classList.add("alert-error", "visible")
          // sentMessage.current.innerHTML = CONTACT_ERROR.error
        })
        .finally(() => {
          actions.setSubmitting(false)
          actions.resetForm()
          setFadeProp({
            fade: "",
          })
        })
    },
  })
  return (
    <Wrapper
      ref={contactForm}
      className="mb-12"
      name="ambulant-design-contact"
      method="post"
      onSubmit={formik.handleSubmit}
      data-netlify={true}
      data-netlify-honeypot="bot-field"
    >
      <input type="hidden" name="form-name" value="ambulant-design-contact" />
      <div hidden>
        Don’t fill this out if you’re human: <input name="bot-field" />
      </div>
      <div className="input-container mb-6">
        <label htmlFor="from_name">Name</label>
        <input
          id="from_name"
          name="from_name"
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder="Your name"
          className={`px-2.5 py-2 text-gray-700 bg-gray-50 border-transparent rounded block w-full focus:outline-none focus:bg-stone-100 focus:text-gray-900
          ${
            formik.errors.from_name && formik.touched.from_name
              ? "form-input error"
              : "form-input"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.from_name}
        />
        {!!formik.touched.from_name && formik.errors.from_name ? (
          <div className="alert-error py-1 px-2">{formik.errors.from_name}</div>
        ) : null}
      </div>

      <div className="input-container mb-6">
        <label htmlFor="reply_to">Email</label>
        <input
          id="reply_to"
          name="reply_to"
          type="email"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder="Your email"
          className={`px-2.5 py-2 text-gray-700 bg-gray-50 border-transparent rounded block w-full focus:outline-none focus:bg-stone-100 focus:text-gray-900 ${
            formik.errors.reply_to && formik.touched.reply_to
              ? "form-input error"
              : "form-input"
          }`}
          valid={formik.touched.message && !formik.errors.message}
          error={formik.touched.message && formik.errors.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.reply_to}
        />
        {!!formik.touched.reply_to && formik.errors.reply_to ? (
          <div className="alert-error py-1 px-2">{formik.errors.reply_to}</div>
        ) : null}
      </div>

      <div className="input-container mb-6">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder="Your subject"
          className={`px-2.5 py-2 text-gray-700 bg-gray-50 border-transparent rounded block w-full focus:outline-none focus:bg-stone-100 focus:text-gray-900 ${
            formik.errors.subject && formik.touched.subject
              ? "form-input error"
              : "form-input"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.subject}
        />
        {!!formik.touched.subject && formik.errors.subject ? (
          <div className="alert-error py-1 px-2">{formik.errors.subject}</div>
        ) : null}
      </div>

      <div className="input-container mb-6">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          type="message"
          autoComplete="off"
          placeholder="Your message"
          rows="4"
          className={`px-2.5 py-2 text-gray-700 bg-gray-50 border-transparent rounded block w-full focus:outline-none focus:bg-stone-100 focus:text-gray-900 ${
            formik.errors.message && formik.touched.message
              ? "form-input error"
              : "form-input"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
        />
        {!!formik.touched.message && formik.errors.message ? (
          <div className="alert-error py-1 px-2">{formik.errors.message}</div>
        ) : null}
      </div>

      <button
        type="submit"
        className="submit text-center btn-solid px-4 py-2 mt-2 mb-4 border rounded block w-full"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <>
            <span className="flex flex-row items-center justify-center">
              <span className="btn-icon">
                <Oval
                  height={30}
                  width={30}
                  color="#F67C6D"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#F67C6D"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </span>
              <span className="btn-text">Submitting …</span>
            </span>
          </>
        ) : (
          <span className="btn-text">Get in touch …</span>
        )}
      </button>
      <div
        className={`form-message px-2.5 py-2 ${alert.type} ${fadeProp.fade}`}
        id="output"
      >
        {alert.msg}
      </div>
    </Wrapper>
  )
}

export const Wrapper = styled.form`
  .form-message {
    opacity: 1;
    max-height: inherit;
  }
  .form-message.fade-out {
    opacity: 0;
    -webkit-transition: all 0.44s ease;
    -o-transition: all 0.44s ease;
    transition: all 0.44s ease;
    line-height: 0;
  }
  .alert-error {
    background-color: rgb(255, 245, 245);
    color: rgb(120, 27, 0);
    white-space: pre-line;
  }
  .alert-success {
    background-color: rgb(220 252 231);
    color: rgb(21 128 61);
    white-space: pre-line;
  }
  .submit {
    overflow: visible;
    white-space: nowrap;
    text-transform: none;
    -webkit-appearance: none;
    display: inline-block;
    box-sizing: border-box;
    padding: 0.5rem 30px;
    vertical-align: middle;
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: center;
    text-decoration: none;
    letter-spacing: 0.005em;
    transition: 0.1s ease-in-out;
    transition-property: all;
    transition-property: color, background-color, border-color;
    background-color: var(--clr-grey-9);
    color: var(--clr-white);
    border: 1px solid transparent;

    &:active,
    &:focus,
    &:hover {
      cursor: pointer;
      color: var(--clr-links);
      border-color: var(--clr-links);
      background: transparent;
    }
    &:disabled {
      cursor: pointer;
      background-color: #fafbfc;
      color: var(--clr-grey-3) !important;
      border-color: var(--clr-grey-4);
      box-shadow: none;
      &:hover,
      &:focus {
        cursor: not-allowed;
      }
    }
    .btn-icon,
    .btn-text {
      padding: 0 0.5rem;
      line-height: 30px;
    }
  }
`

export default ContactForm
