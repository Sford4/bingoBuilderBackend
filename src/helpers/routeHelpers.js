const Joi = require('joi');

module.exports = {
	validateParam: (schema, name) => {
		return (req, res, next) => {
			const result = Joi.validate({ param: req['params'][name] }, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			}

			if (!req.value) req.value = {};
			if (!req.value['params']) req.value['params'] = {};

			req.value['params'][name] = result.value.param;
			next();
		};
	},

	validateBody: schema => {
		return (req, res, next) => {
			// console.log('request at validation', req.body.obj);
			const result = Joi.validate(req.body, schema);

			if (result.error) {
				return res.status(400).json(result.error);
			}

			if (!req.value) req.value = {};
			if (!req.value['body']) req.value['body'] = {};

			req.value['body'] = result.value;
			next();
		};
	},

	schemas: {
		userSchema: Joi.object().keys({
			userName: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string()
		}),

		userOptionalSchema: Joi.object().keys({
			firstName: Joi.string(),
			lastName: Joi.string(),
			email: Joi.string().email(),
			saved: Joi.object().keys({
				title: Joi.string(),
				keywords: Joi.array().items(Joi.string()),
				squares: Joi.array().items(Joi.string())
			})
		}),

		boardSchema: Joi.object().keys({
			title: Joi.string().required(),
			keywords: Joi.array().items(Joi.string()).required(),
			squares: Joi.array().items(Joi.string()).required(),
			creator: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
		}),

		putBoardSchema: Joi.object().keys({
			title: Joi.string().required(),
			keywords: Joi.array().items(Joi.string()).required(),
			squares: Joi.array().items(Joi.string()).required(),
			creator: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
		}),

		patchBoardSchema: Joi.object().keys({
			title: Joi.string(),
			keywords: Joi.array().items(Joi.string()),
			squares: Joi.array().items(Joi.string()),
			creator: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
		}),

		gameSchema: Joi.object().keys({
			board: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
			organizer: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
			players: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
		}),

		idSchema: Joi.object().keys({
			param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
		})
	}
};
