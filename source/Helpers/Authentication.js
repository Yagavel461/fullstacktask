const {isEmpty, getIdAndRole} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const UserModel = require('../Models/UserModel');

/**
 * Authenticate logged-in user
 * @returns {(function(*, *, *): Promise<*|undefined>)|*}
 * @constructor
 */

const Authentication = () => {
	return async (request, response, next) => {
		try {
			const [UserRole, UserId] = getIdAndRole(request.headers['x-consumer-username']);
			if (isEmpty(UserRole) || isEmpty(UserId)) {
				let message = 'Unauthorized Access!';
				return Responder.sendFailureMessage(response, message, 401);
			} else {
				if (UserRole === 'admin' || UserRole === 'sub-admin') {
					let condition = {user_id: UserId, status: 'active'};
					let projection = {
						_id: 0,
						user_id: 1,
						'name.full': 1,
						email: 1,
						position: 1,
						role: 1
					};
					// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
					let user = await UserModel?.find(condition, projection).sort({createdAt: -1}).lean();
					if (isEmpty(user)) {
						let message = 'Not a valid user!';
						return Responder.sendFailureMessage(response, message, 401);
					} else {
						request.body.loggedUser.name = user?.name?.full;
						request.body.loggedUser.id = user?.admin_id;
						request.body.loggedUser.role = user?.role || '';
						next();
					}
				} else {
					let message = 'Not a valid user';
					return Responder.sendFailureMessage(response, message, 401);
				}
			}
		} catch (error) {
			return Responder.sendFailureMessage(response, error, 500);
		}
	};
};

module.exports = Authentication;
