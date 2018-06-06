const router = require('express-promise-router')();

const gamesController = require('../controllers/games');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/').get(gamesController.index).post(validateBody(schemas.gameSchema), gamesController.newGame);

router
	.route('/:id')
	.get(validateParam(schemas.idSchema, 'id'), gamesController.getGame)
	.delete(validateParam(schemas.idSchema, 'id'), gamesController.deleteGame);

module.exports = router;
