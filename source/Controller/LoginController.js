const {createHashPwd} = require('../Helpers/Utils');
const passport = require('passport');
const UserModel = require('../Models/UserModel');
const LocalStrategy = require('passport-local').Strategy;
const AuthController = {
	/**
	 * Admin Login
	 * @param userLoginDetails
	 * @param loginDevice
	 * @returns {Promise<{data: {admin: {admin_id: (number|*), auth_token: *}}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	login: async (userLoginDetails) => {
		try {
			passport.use(
				'admin-local',
				new LocalStrategy(
					{
						usernameField: 'email',
						passwordField: 'password'
					},
					async (email, password, done) => {
						try {
							let queryOptions = {
								condition: {
									email: email,
									password: createHashPwd(password),
									status: 'active'
								},
								projection: {
									last_login: 1,
									verification_code: 1,
									phone: 1,
									createdAt: 1,
									admin_id: 1,
									email: 1
								},
								options: {
									lean: false
								}
							};
							const admin = await UserModel.find(queryOptions);

							if (!admin) {
								return done(undefined, false, {message: 'Invalid Credentials'});
							}
							// ... (The rest of the authentication logic as in your original code)
						} catch (error) {
							return done(error);
						}
					}
				)
			);
			// Authenticate the user using passport
			passport.authenticate('admin-local', (error, user, info) => {
				if (error) {
					return {error: true, message: error.message || 'Something Went Wrong!'};
				}
				if (!user) {
					return {error: true, message: info.message || 'Invalid Credentials'};
				}
			})(userLoginDetails.email, userLoginDetails.password);
		} catch (error) {
			return {error: true, message: error.message || 'Something Went Wrong!'};
		}
	}
};

module.exports = AuthController;
