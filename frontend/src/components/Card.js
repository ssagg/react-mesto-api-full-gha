import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";
function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__icon ${isLiked && "card__icon_active"}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <div className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwn && (
        <button
          aria-label="Удалить"
          className="card__delete"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__text">
        <h3 className="card__title">{card.name}</h3>
        <div className="card__icon-box">
          <button
            aria-label="Лайк"
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <div className="card__like-counter">{card.likes.length}</div>
        </div>
      </div>
    </div>
  );
}
export default Card;
