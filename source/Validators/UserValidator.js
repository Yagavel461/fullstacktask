const {check} = require('express-validator');

const UserValidator = {
	usercreateValidator: () => {
		return [
			check('name', 'Please provide name.')
				.notEmpty()
				.isLength({min: 1, max: 254})
				.withMessage('name must be between 1 and 254 characters.')
				.matches(/^[\d !&',.A-Za-z]+$/)
				.withMessage('Name must be alphabetic.'),
			check('phone.national_number', 'Please provide valid mobile number.')
				.notEmpty()
				.trim()
				.isMobilePhone('en-IN')
				.withMessage('Invalid mobile number'),
		];
	},
	edituserValidator: () => {
		return [
			check('user_id', 'Please provide userId.').notEmpty(),
			check('phone', 'Please provide phone.').notEmpty(),
			check('user_name', 'Please provide user name.').notEmpty()
		];
	}
};

module.exports = UserValidator;
