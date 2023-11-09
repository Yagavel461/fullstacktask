const Express = require('express');
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Router = Express.Router();
const {usercreateValidator, edituserValidator} = require('../Validators/UserValidator');
const OrganizationController = require('../Controller/OrganizationController');
const {validationResult} = require('express-validator');

// Router.use(Authentication());
Router.get('/user/list', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.getuserList(
			request?.body?.loggedUser,
			request?.query
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/create', usercreateValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await OrganizationController.createUser(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {;
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/details/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.agentDetails(
			request?.body?.loggedUser,
			request?.params?.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/edit-user', edituserValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await OrganizationController.updatePhone(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
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

Router.patch('/change-status/:userIdId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.changeStatus(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.delete('/delete/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.deleteAgent(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.use('/', Router);

module.exports = Router;
