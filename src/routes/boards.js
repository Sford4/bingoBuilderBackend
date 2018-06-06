const router = require('express-promise-router')();

const boardsController = require('../controllers/boards');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/').get(boardsController.index).post(validateBody(schemas.boardSchema), boardsController.newBoard);

router
	.route('/:id')
	.get(validateParam(schemas.idSchema, 'id'), boardsController.getBoard)
	.put([validateParam(schemas.idSchema, 'id'), validateBody(schemas.putBoardSchema)], boardsController.replaceBoard)
	.patch(
		[validateParam(schemas.idSchema, 'id'), validateBody(schemas.patchBoardSchema)],
		boardsController.updateBoard
	)
	.delete(validateParam(schemas.idSchema, 'id'), boardsController.deleteBoard);

module.exports = router;
