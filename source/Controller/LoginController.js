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
	async login(userLoginDetails) {
		try {
			// Configure the local strategy
			passport.use(
				'admin-local',
				new LocalStrategy(
					{
						usernameField: 'email',
						passwordField: 'password'
					},
					async (email, password, done) => {
						try {
							// Find the admin with the given email and password
							const admin = await UserModel.findOne({
								email: email,
								password: password,
								status: 'active'
							});

							if (!admin) {
								return done(undefined, false, {message: 'Invalid Credentials'});
							}

							// Return the authenticated admin
							return done(undefined, admin);
						} catch (error) {
							// eslint-disable-next-line no-console
							console.error(error.message);
							return done(error);
						}
					}
				)
			);

			// Authenticate the user using passport
			const loginResult = await passport.authenticate('admin-local')(
				userLoginDetails.email,
				userLoginDetails.password
			);
			// eslint-disable-next-line no-console
			console.log(loginResult);

			if (loginResult.error) {
				return {error: true, message: loginResult.message || 'Something Went Wrong!'};
			}

			// Handle successful authentication
			// ...
		} catch (error) {
			return {error: true, message: error.message || 'Something Went Wrong!'};
		}
	}
};

module.exports = AuthController;
