const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./users');
const cardRouter = require('./cards');
const { errorsLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const link = require('../utils/regexPattern');
const {
  createUser,
  login,
} = require('../controllers/users');
const NotFoundError = require('../errors/NotFound');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2)
      .max(30),
    password: Joi.string().required().min(2),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(link),
    email: Joi.string().email().required().min(2)
      .max(30),
    password: Joi.string().required().min(2),
  }),
}), createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Несуществующий адрес'));
});
router.use(errorsLogger);
router.use(errors());

module.exports = router;
