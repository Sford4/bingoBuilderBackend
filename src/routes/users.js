const express = require('express');
//const router = express.Router()
const router = require('express-promise-router')();

const usersController = require('../controllers/users');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/').get(usersController.index).post(validateBody(schemas.userSchema), usersController.newUser);

router
	.route('/:id')
	.get(validateParam(schemas.idSchema, 'id'), usersController.getUser)
	.put([validateParam(schemas.idSchema, 'id'), validateBody(schemas.userSchema)], usersController.replaceUser)
	.patch(
		[validateParam(schemas.idSchema, 'id'), validateBody(schemas.userOptionalSchema)],
		usersController.updateUser
	)
	.delete(validateParam(schemas.idSchema, 'id'), usersController.deleteUser);

router
	.route('/save/:id')
	.patch(
		[validateParam(schemas.idSchema, 'id'), validateBody(schemas.userOptionalSchema)],
		usersController.saveUnfinishedBoard
	);

router
	.route('/:id/boards')
	.get(validateParam(schemas.idSchema, 'id'), usersController.getUserBoards)
	.post([validateParam(schemas.idSchema, 'id'), validateBody(schemas.userBoardSchema)], usersController.newUserBoard);

module.exports = router;
