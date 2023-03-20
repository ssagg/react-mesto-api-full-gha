import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginDataContext } from "../contexts/LoginDataContext";
import { useContext } from "react";

function NavBar({ handleLogout, userEmail }) {
  const navigate = useNavigate();
  const loggedIn = useContext(LoginDataContext);

  function signOut() {
    localStorage.removeItem("token");
    handleLogout();
    navigate("/sign-in", { replace: true });
  }
  return (
    <nav className="header__menu">
      {loggedIn && (
        <>
          <p className="header__email">
            {userEmail.email || userEmail.data.email}
          </p>
          <button onClick={signOut} className="header__button">
            Выход
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
