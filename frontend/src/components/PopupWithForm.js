import React from "react";

function PopupWithForm({
  name,
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  buttonText,
  isValid,
}) {
  return (
    <div
      className={`popup popup-${name} ${isOpen && "popup_opened"}`}
      id="popup-edit"
    >
      <div className="popup__container">
        <button
          aria-label="Закрыть"
          className={`popup__button-close popup-${name}__button-close`}
          type="button"
          onClick={onClose}
        />
        <h2 className="popup__title">{title}</h2>
        <form
          className={`popup__form popup-${name}__form`}
          name={`${name}-edit`}
          id={`${name}-edit`}
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button
            disabled={!isValid}
            className={`popup__button ${!isValid && "popup__button_disabled"}`}
            type="submit"
            id={`button-${name}`}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
