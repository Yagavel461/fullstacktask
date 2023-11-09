/* eslint-disable no-self-assign */
/* eslint-disable no-constant-condition */
const {isEmpty, getShortId, dateFinder} = require('../Helpers/Utils');
const {findOneUser} = require('../Repository/UserRepositary');
const UserModel = require('../Models/UserModel');

const OrganizationController = {
	/**
	 * Get user list
	 * @param requestData
	 * @param query
	 * @returns {Promise<{data: {user: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown, total: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown}, error: boolean, message: string}|{error: boolean, message}>}
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
		// eslint-disable-next-line no-console
		console.log(requestData);
		if (requestData.role !== 'admin') {
			queryData['user_id'] = requestData?.user_id;
		}
		try {
			let projection = {
				_id: 0,
				user_id: 1,
				'name.full': 1,
				role: 1,
				dob: 1,
				createdAt: 1,
				address: 1,
				status: 1,
				'phone.national_number': 1
			};
			if (query.limit === 'all') {
				projection = {
					_id: 0,
					user_id: 1,
					'name.full': 1,
					role: 1
				};
				// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
				let result = await UserModel.find(queryData, projection).sort({createdAt: -1}).lean();
				if (result) {
					return {
						error: false,
						message: 'User list are.',
						data: {
							user: result
						}
					};
				}
			} else {
				let [result, totalCount] = await Promise.all([
					// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
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
		try {
			const existingUser = await UserModel.findOne({
				'phone.national_number': requestData?.phone?.national_number
			});

			if (existingUser) {
				return {error: true, message: 'A User with the same phone number already exists'};
			} else {
				const userData = {
					user_id: getShortId(),
					phone: {national_number: requestData?.phone?.national_number},
					name: {full: requestData?.name},
					password: requestData?.password,
					role: requestData?.role,
					gender: requestData?.gender || 'male',
					email: {primary: requestData?.email},
					address: requestData?.location,
					position: requestData?.position
				};

				const newUser = new UserModel(userData); // Creating a new instance
				const savedUser = await newUser.save(); // Save the instance

				return savedUser
					? {error: false, message: 'User created successfully', data: savedUser}
					: {error: true, message: 'Could not create the user'};
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * get user Details
	 * @param requestData
	 * @param user_id
	 * @returns {Promise<{data: {user: ({response: *, error: *, body: *}|{error: string}|{response: undefined, error, body: undefined}|{response: undefined, error: string, body: undefined})}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message}>}
	 */
	userDetails: async (requestData, userId) => {
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
					return isEmpty(user)
						? {
								error: false,
								message: 'User Details not foun!.',
								data: {user: ''}
						  }
						: {
								error: false,
								message: 'User details.',
								data: {user: user}
						  };
				} catch (error) {
					// eslint-disable-next-line no-console
					console.log(error);
					return {
						error: true,
						message: error.message
					};
				}
			} else {
				return {error: true, message: 'No user found!'};
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
		// let userId = requestData.loggedUser.id;
		if (0) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let user_id = requestData.user_id;
				let userDetails = await findOneUser(
					{'phone.national_number': requestData?.phone, user_id: {$ne: user_id}},
					{
						_id: 0,
						user_id: 1,
						name: 1,
						phone: 1,
						createdAt: -1
					},
					false
				);
				if (isEmpty(userDetails)) {
					try {
						let user = await findOneUser(
							{user_id: user_id},
							{
								agent_id: 1,
								name: 1,
								'phone.national_number': 1,
								createdAt: 1
							},
							false
						);
						if (user) {
							user.name.full = requestData?.name;
							user.phone.national_number = requestData?.phone;
							user.markModified('name');
							user.markModified('phone.national_number');
							await user.save();
							return {
								error: false,
								data: {
									user_id: user.user_id,
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
						// eslint-disable-next-line no-console
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
		// eslint-disable-next-line no-constant-condition
		if (0) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let user = await findOneUser(
					{user_id: user_id},
					{
						_id: 1,
						name: 1,
						user_id: 1,
						position: 1,
						email: 1,
						dob: 1,
						status: 1,
						role: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(user)) {
					return {error: false, message: 'Invalid User!'};
				} else {
					let status = user['status'] === 'active' ? 'deactive' : 'active';
					user.status = status;
					user.markModified('status');
					let savedData = await user.save();
					return {
						error: false,
						data: {
							name: savedData?.name,
							user_id: savedData.user_id,
							status: savedData?.status
						},
						message: 'Status changed successfully!'
					};
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
		try {
			let user = await findOneUser(
				{user_id: user_id},
				{
					_id: 1,
					user_id: 1,
					createdAt: 1
				},
				false
			);
			if (isEmpty(user)) {
				return {error: false, message: 'Invalid User!'};
			} else {
				await user.delete();
				return {error: false, data: user, message: 'User deleted successfully!'};
			}
		} catch (error) {
			return {
				error: true,
				message: error?.message
			};
		}
	}
};

module.exports = OrganizationController;
