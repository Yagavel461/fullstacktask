const {check} = require('express-validator');

const LoginValidation = {
	loginValidation: () => {
		return [
			check('email', 'Please provide email ID.')
				.trim()
				.notEmpty()
				.isEmail()
				.withMessage('Please enter a valid email ID.'),
			check('password', 'Please enter your password.').trim().notEmpty()
		];
	}
};

module.exports = LoginValidation;
