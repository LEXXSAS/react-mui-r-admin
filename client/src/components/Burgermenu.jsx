import { Container } from '@mui/material';
import { useState } from 'react'

const Burgermenu = () => {
  const [menuActive, setMenuActive] = useState(true);

  const burgerActive = () => {
    menuActive ? setMenuActive(false) : setMenuActive(true)
    bodyLock()
  }

  const bodyLock = () => {
    menuActive ? document.body.classList.add('lock') : document.body.classList.remove('lock')
  }

  return (
    <header className="header">
    <Container maxWidth="xl" >
      <div className="header__body">
        <div></div>
        <div className={menuActive ? "header__burger" : "header__burger active"} onClick={() => burgerActive()}>
          <span></span>
        </div>
        <nav className={menuActive ? "header__menu" : "header__menu active"}>
          <ul className="header__list">
            <li>
              <a href="" className="header__link">Home</a>
            </li>
            <li>
              <a href="" className="header__link">About us</a>
            </li>
            <li>
              <a href="" className="header__link">Blog</a>
            </li>
            <li>
              <a href="" className="header__link">Articles</a>
            </li>
            <li>
              <a href="" className="header__link">Contacts</a>
            </li>
          </ul>
        </nav>
      </div>
      </Container>
  </header>
  )
}

export default Burgermenu
