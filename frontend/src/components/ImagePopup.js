import React from "react";
function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup-image ${card.isOpen && "popup_opened"}`}
      id="popup-image"
    >
      <div className="popup-image__container">
        <button
          aria-label="Закрыть"
          className="popup__button-close popup-image__button-close"
          type="button"
          onClick={onClose}
        ></button>
        <img className="popup-image__image" src={card.link} alt={card.name} />
        <div className="popup-image__title" id="caption">
          {card.name}
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
