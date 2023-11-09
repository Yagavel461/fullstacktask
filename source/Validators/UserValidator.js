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
			check('email', 'Please provide a valid email address.')
				.notEmpty()
				.isEmail()
				.withMessage('Invalid email address'),
			check('position', 'Please provide position.').notEmpty(),
			check('location').custom((value, {}) => {
				if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
					throw new Error('Location object is required and should not be empty.');
				}

				// Validate individual properties within the location object
				if (
					!value.flat_no ||
					!value.street_name ||
					!value.area ||
					!value.city ||
					!value.state ||
					!value.pincode ||
					!value.city.name ||
					!value.city.code ||
					!value.state.name ||
					!value.state.code
				) {
					throw new Error('Location object properties are incomplete.');
				}

				return true;
			})
		];
	},
	edituserValidator: () => {
		return [
			check('user_id', 'Please provide userId.').notEmpty(),
			check('phone', 'Please provide valid mobile number.')
				.notEmpty()
				.trim()
				.isMobilePhone('en-IN')
				.withMessage('Invalid mobile number'),
			check('name', 'Please provide user name.').notEmpty()
		];
	}
};

module.exports = UserValidator;
