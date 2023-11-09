const UserModel = require('../Models/UserModel');
const {isEmpty} = require('../Helpers/Utils');

const UserQuery = {
	/**
	 * To do find one query
	 * @param condition
	 * @param projection
	 * @param islean
	 * @returns {Promise<*>}
	 */
	findOneUser: async (condition, projection, islean = true) => {
		if (isEmpty(projection)) {
			projection = {
				agent_id: 1,
				'name.full': 1,
				status: 1,
				role: 1,
				createdAt: 1
			};
		}
		let user = await UserModel.findOne(condition, projection).lean(islean);
		return user;
	},

	findUser: async (condition, projection, islean = true) => {
		if (isEmpty(projection)) {
			projection = {
				agent_id: 1,
				'name.full': 1,
				status: 1,
				role: 1,
				createdAt: 1
			};
		}
		// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
		let user = await UserModel.find(condition, projection).lean(islean);
		return user;
	}
};

module.exports = UserQuery;
