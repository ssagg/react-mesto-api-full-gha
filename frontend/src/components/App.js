import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import * as Auth from "../utils/Auth.js";

import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Registration from "./Registration";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { LoginDataContext } from "../contexts/LoginDataContext.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false });

  const [isRegPopupOpen, setIsRegPopupOpen] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState({});
  const [isRegSuccess, setIsRegSuccess] = useState(false);

  const [cards, setCards] = useState([]);

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isRegPopupOpen ||
    selectedCard.isOpen;

  const navigate = useNavigate();

  function handleLogin(userCredentials) {
    Auth.signin(userCredentials)
      .then((res) => {
        console.log(res)
        localStorage.setItem("token", res.jwt);
        api.setHeaders(res.jwt)
        setLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        loadUserEmail(userCredentials);
      });
  }

  function handleLogout() {
    setLoggedIn(false);
  }
  function loadUserEmail(email) {
    setUserEmail(email);
  }
  function handleRegistration(userCredentials) {
    Auth.signup(userCredentials)
      .then((res) => {
        setIsRegPopupOpen(!isRegPopupOpen);
        setIsRegSuccess(true);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        setIsRegPopupOpen(!isRegPopupOpen);
        setIsRegSuccess(false);
        console.log(err);
      });
  }

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (token) {
      Auth.userValidation(token).then((res) => {
        api.setHeaders(token)
        setLoggedIn(true);
        loadUserEmail(res);
        navigate("/", { replace: true });
      });
    }
  }

  // useEffect(() => {
  //   tokenCheck();
  // }, []);

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    tokenCheck()
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getUserInfo()])
        .then(([cards, userData]) => {
          setCards([...cards]);
          setCurrentUser(userData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [loggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    setButtonText("Сохранить");
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    setButtonText("Сохранить");
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    setButtonText("Создать");
  }
  function handleCardClick(card) {
    setSelectedCard({
      ...selectedCard,
      isOpen: true,
      link: card.link,
      name: card.name,
    });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .setLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsRegPopupOpen(false);
    setSelectedCard({ ...selectedCard, isOpen: false });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addNewCard({ name: data.name, link: data.link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .sendUserInfo(data)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .sendAvatar(data)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <LoginDataContext.Provider value={loggedIn}>
          <Header userEmail={userEmail} handleLogout={handleLogout} />
          <Routes>
            <Route
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
              <Route
                path="/"
                element={
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                }
              />
            </Route>

            <Route
              path="/sign-in"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route
              path="/sign-up"
              element={<Registration handleRegistration={handleRegistration} />}
            />
          </Routes>

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            buttonText={buttonText}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            buttonText={buttonText}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            buttonText={buttonText}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <InfoTooltip
            isOpen={isRegPopupOpen}
            onClose={closeAllPopups}
            isRegSuccess={isRegSuccess}
          />

          <Footer />
        </LoginDataContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
