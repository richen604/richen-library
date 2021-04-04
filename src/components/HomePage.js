import React from 'react'
import './HomePage.css'
import { ReactComponent as BookLogo } from '../images/undraw_book_lover_mkck.svg'
import { ReactComponent as NatureLogo } from '../images/undraw_friendship_mni7.svg'

export default function HomePage() {
  return (
    <div id="homepage">
      <div id="intro-left">
        <h5 className="intro-heading">
          Let your understanding{' '}
          <strong className="intro-strongtext">grow</strong>
        </h5>
        <BookLogo id="book-svg" />
      </div>
      <div id="intro-right">
        <h5 className="intro-heading">
          So you can enjoy the{' '}
          <strong className="intro-strongtext">finer things in life</strong>
        </h5>
        <NatureLogo id="nature-svg" />
      </div>
    </div>
  )
}
