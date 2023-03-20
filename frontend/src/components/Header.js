import React, { useContext } from "react";
import logo from "../images/logo/logo.svg";
import NavBar from "./NavBar";
import { Link, useLocation } from "react-router-dom";
import { LoginDataContext } from "../contexts/LoginDataContext.js";

function Header({ handleLogout, userEmail }) {
  const location = useLocation();
  const loggedIn = useContext(LoginDataContext);
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />

      {loggedIn ? (
        <NavBar handleLogout={handleLogout} userEmail={userEmail} />
      ) : location.pathname === "/sign-in" ? (
        <Link className="header__link" to="sign-up">
          Регистрация
        </Link>
      ) : (
        <Link className="header__link" to="sign-in">
          Войти
        </Link>
      )}
    </header>
  );
}

export default Header;
