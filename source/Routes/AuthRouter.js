const Express = require('express');
const Router = Express.Router();
const LoginController = require('../Controller/LoginController');
// eslint-disable-next-line no-unused-vars
const {loginValidation, verifyOtpValidation} = require('../Validators/AuthValidator');
const {validationResult} = require('express-validator');
const Responder = require('../App/Responder');
// eslint-disable-next-line no-unused-vars
const {isEmpty} = require('../Helpers/Utils');

Router.post('/login', loginValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await LoginController.login(request?.body, request?.useragent['source']);

			if (error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

module.exports = Router;
