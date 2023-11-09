const Express = require('express');
const {isEmpty, getIdAndRole} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Router = Express.Router();
const {usercreateValidator, edituserValidator} = require('../Validators/UserValidator');
const OrganizationController = require('../Controller/OrganizationController');
const {validationResult} = require('express-validator');
const UserModel = require('../Models/UserModel');

const Authentication = async (request, response) => {
	const [UserRole, UserId] = getIdAndRole(request.headers['x-consumer-username']);
	if (isEmpty(UserRole) || isEmpty(UserId)) {
		let message = 'Unauthorized Access!';
		return Responder.sendFailureMessage(response, message, 401);
	} else {
		if (UserRole === 'admin' || UserRole === 'manager' || UserRole === 'employee') {
			let condition = {user_id: UserId, status: 'active'};
			let projection = {
				_id: 0,
				user_id: 1,
				name: 1,
				email: 1,
				position: 1,
				role: 1,
				address: 1
			};
			// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
			let user = await UserModel?.find(condition, projection).sort({createdAt: -1}).lean();
			if (isEmpty(user)) {
				let message = 'Not a valid user!';
				return Responder.sendFailureMessage(response, message, 401);
			} else {
				let object = {
					name: user[0].name,
					user_id: user[0]?.user_id,
					role: user[0]?.role
				};
				return object;
			}
		} else {
			let message = 'Not a valid user';
			return Responder.sendFailureMessage(response, message, 401);
		}
	}
	// 	try {
	// 		const [UserRole, UserId] = getIdAndRole(request.headers['x-consumer-username']);
	// 		if (isEmpty(UserRole) || isEmpty(UserId)) {
	// 			let message = 'Unauthorized Access!';
	// 			return Responder.sendFailureMessage(response, message, 401);
	// 		} else {
	// 			if (UserRole === 'admin' || UserRole === 'sub-admin') {
	// 				let condition = {user_id: UserId, status: 'active'};
	// 				let projection = {
	// 					_id: 0,
	// 					user_id: 1,
	// 					'name.full': 1,
	// 					email: 1,
	// 					position: 1,
	// 					role: 1
	// 				};
	// 				// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
	// 				let user = await UserModel?.find(condition, projection).sort({createdAt: -1}).lean();
	// 				if (isEmpty(user)) {
	// 					let message = 'Not a valid user!';
	// 					return Responder.sendFailureMessage(response, message, 401);
	// 				} else {
	// 					request.body.loggedUser.name = user?.name?.full;
	// 					request.body.loggedUser.id = user?.admin_id;
	// 					request.body.loggedUser.role = user?.role || '';
	// 					next();
	// 				}
	// 			} else {
	// 				let message = 'Not a valid user';
	// 				return Responder.sendFailureMessage(response, message, 401);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		return Responder.sendFailureMessage(response, error, 500);
	// 	}
	// };
};

Router.get('/list', async (request, response) => {
	try {
		let loggedUser = await Authentication(request, response);
		// eslint-disable-next-line no-undef
		let {error, message, data} = await OrganizationController.getuserList(loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error.message);
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
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/details/:userId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.userDetails(
			request?.body?.loggedUser,
			request?.params?.userId
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

Router.patch('/change-status/:userId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.changeStatus(
			request?.body?.loggedUser,
			request.params.userId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.delete('/delete/:userId', async (request, response) => {
	try {
		let {error, message, data} = await OrganizationController.deleteUser(
			request?.body?.loggedUser,
			request.params.userId
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
