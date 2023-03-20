const cardSchema = require('../models/card');
const NotFoundError = require('../errors/NotFound');
const NotAuthorized = require('../errors/Forbidden');
const ValidationError = require('../errors/BadRequest');

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    let resp = await cardSchema.create({ name, link, owner: req.user._id });
    resp = await resp.populate('owner');
    res.send(resp);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании карточки'));
    } else {
      next(err);
    }
  }
};

module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

module.exports.removeCard = (req, res, next) => {
  const removeCard = () => cardSchema.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card)).catch(next);

  cardSchema.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Такой карточки не существует'); })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return removeCard();
      } throw new NotAuthorized('Чужая карточка');
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = async (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
    .then((likes) => {
      if (likes) {
        return res.send(likes);
      } throw new NotFoundError('Такой карточки не существует. Нельзя убрать лайк');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => cardSchema
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate(['owner', 'likes'])
  .then((likes) => {
    if (likes) {
      return res.send(likes);
    } throw new NotFoundError('Такой карточки не существует. Нельзя убрать лайк');
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные карточки'));
    } else {
      next(err);
    }
  });
