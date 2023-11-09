/* eslint-disable no-console */
/* eslint-disable unicorn/no-array-method-this-argument */
const {isEmpty, getShortId, dateFinder} = require('../Helpers/Utils');
const {findOneAgent, findOneUser} = require('../Repository/UserRepositary');
const UserModel = require('../Models/UserModel');
// const moment = require('moment');

const OrganizationController = {
	/**
	 * Get user list
	 * @param requestData
	 * @param query
	 * @returns {Promise<{data: {agent: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown, total: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown}, error: boolean, message: string}|{error: boolean, message}>}
	 */
	getuserList: async (requestData, query) => {
		let limit = 10;
		let queryData = {};
		let page = 1;
		if (query?.limit) limit = query?.limit === 'all' ? query?.limit : Number.parseInt(query?.limit);
		if (query?.page) page = Number.parseInt(query?.page);
		if (query?.user_id) queryData.user_id = query?.user_id;
		if (query?.phone) queryData['phone.national_number'] = query?.phone;
		if (query?.status) queryData.status = query?.status;
		if (query?.from_time || query?.to_time || query?.date_option) {
			queryData['createdAt'] = dateFinder(query);
		}
		try {
			let projection = {
				_id: 0,
				user_id: 1,
				'name.full': 1,
				role: 1,
				createdAt: 1,
				address: 1,
				status: 1,
				'phone.national_number': 1
			};
			if (query.limit === 'all') {
				projection = {
					_id: 0,
					agent_id: 1,
					'name.full': 1,
					role: 1
				};
				// eslint-disable-next-line unicorn/no-array-callback-reference
				let result = await UserModel.find(queryData, projection).sort({createdAt: -1}).lean();
				if (result) {
					return {
						error: false,
						message: 'User list are.',
						data: {
							agent: result
						}
					};
				}
			} else {
				let [result, totalCount] = await Promise.all([
					// eslint-disable-next-line unicorn/no-array-callback-reference
					await UserModel.find(queryData, projection)
						.sort({createdAt: -1})
						.skip((page - 1) * limit)
						.limit(limit)
						.lean(),
					// eslint-disable-next-line unicorn/no-array-callback-reference
					await UserModel.find(queryData).count()
				]);
				if (result) {
					return {
						error: false,
						message: 'User list are.',
						data: {
							user: result,
							total: totalCount
						}
					};
				}
			}
		} catch (error) {
			return {
				error: true,
				message: error.message
			};
		}
	},

	/**
	 * Create User
	 * @param requestData
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}|{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	createUser: async (requestData) => {
		const existingUser = await UserModel.findOne({
			'phone.national_number': requestData?.phone?.national_number
		});
		if (existingUser) {
			return {error: true, message: 'A User with the same phone number already exists'};
		} else {
			const userData = {
				user_id: getShortId(),
				phone: {national_number: requestData?.phone?.national_number},
				name: {full: requestData?.name?.full},
				role: requestData?.role,
				gender: requestData?.gender || 'male',
				email: requestData?.email,
				address: requestData?.location,
				position: requestData?.position
			};
			try {
				const newUser = await UserModel.save(userData);
				return newUser
					? {error: false, message: 'User created successfully', data: newUser}
					: {error: true, message: 'Could not create the user'};
			} catch (error) {
				console.error(error);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},
	/**
	 * get user Details
	 * @param requestData
	 * @param user_id
	 * @returns {Promise<{data: {agent: ({response: *, error: *, body: *}|{error: string}|{response: undefined, error, body: undefined}|{response: undefined, error: string, body: undefined})}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message}>}
	 */
	userDetails: async (requestData) => {
		let userId = requestData?.id;
		if (userId) {
			if (userId) {
				try {
					let user = await findOneUser(
						{user_id: userId},
						{
							_id: 0,
							name: 1,
							address: 1,
							role: 1,
							user_id: 1,
							phone: 1,
							email: 1,
							position: 1,
							status: 1,
							createdAt: 1
						}
					);

					return {
						error: false,
						message: 'User details.',
						data: {user: user}
					};
				} catch (error) {
					return {
						error: true,
						message: error.message
					};
				}
			} else {
				return {error: true, message: 'No agent found!'};
			}
		} else {
			return {error: true, message: 'Unauthorized access.'};
		}
	},
	/**
	 * Update Phone number
	 * @param requestData
	 */
	updatePhone: async (requestData) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let user_id = requestData.agent_id;
				let agentDetails = await findOneUser(
					{'phone.national_number': requestData?.phone, user_id: {$ne: user_id}},
					{
						_id: 0,
						agent_id: 1,
						name: 1,
						phone: 1,
						createdAt: -1
					},
					false
				);
				if (isEmpty(agentDetails)) {
					try {
						let user = await findOneUser(
							{agent_id: agent_id},
							{
								agent_id: 1,
								name: 1,
								'phone.national_number': 1,
								createdAt: 1
							},
							false
						);
						if (user) {
							user.name.full = requestData?.agent_name;
							user.phone.national_number = requestData?.phone;
							user.markModified('name');
							user.markModified('phone.national_number');
							await user.save();
							return {
								error: false,
								data: {
									agent_id: user.user_id,
									name: user.name,
									phone: {
										national_number: user?.phone?.national_number
									}
								},
								message: 'Update success'
							};
						} else {
							return {error: true, message: 'User not found'};
						}
					} catch (error) {
						console.log(error);
						return {error: true, message: 'Failed to update user'};
					}
				} else {
					return {error: false, message: 'Phone Number already exists'};
				}
			} catch (error) {
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Change Status
	 * @param requestData
	 * @param user_id
	 */
	changeStatus: async (requestData, user_id) => {
		let agentId = requestData.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent = await findOneAgent(
					{user_id: user_id},
					{
						_id: 1,
						user_id: 1,
						position:1,
						email:1,
						dob:1,
						status: 1,
						role: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(agent)) {
					return {error: false, message: 'Invalid User!'};
				} else {
					let status = agent['status'] === 'active' ? 'deactive' : 'active';
					agent.status = status;
					agent.markModified('status');
					let response;
					await agent.save();
					return {error: false, data: response, message: 'Status changed successfully!'};
				}
			} catch (error) {
				return {
					error: true,
					message: error?.message || 'Something went to wrong'
				};
			}
		}
	},

	/**
	 * Delete agent
	 * @param requestData
	 * @param user_id
	 */
	deleteUser: async (requestData, user_id) => {
		let userId = requestData.id;
		if (isEmpty(userId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let user = await findOneAgent(
					{user_id: user_id},
					{
						_id: 1,
						agent_id: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(user)) {
					return {error: false, message: 'Invalid User!'};
				} else {
					await user.delete();
					return {error: false, data: {}, message: 'User deleted successfully!'};
				}
			} catch (error) {
				return {
					error: true,
					message: error?.message
				};
			}
		}
	}
};

module.exports = OrganizationController;
