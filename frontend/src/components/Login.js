import React, { useState } from "react";

function Login({ handleLogin }) {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin(userCredentials);
  }

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form
        className={`login__form`}
        name={`login`}
        id={`login`}
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          className="login__input login__input_type_name"
          placeholder="Email"
          id="login-name"
          value={userCredentials.email || ""}
          onChange={handleChange}
        />

        <span
          className="login__error
        "
          id="login-name-error"
        ></span>
        <input
          type="password"
          name="password"
          className="login__input login__input_type_about"
          placeholder="Пароль"
          id="password-about"
          value={userCredentials.password || ""}
          onChange={handleChange}
        />
        <span
          className="login__error
        "
          id="password-name-error"
        ></span>
        <button className={"login__button"} type="submit" id={`button-login`}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
