const DBConnection = require('../App/Connection');
const DataBase = DBConnection.getAdminDBConnection();
const Timestamps = require('mongoose-timestamp');
const mongooseDelete = require('mongoose-delete');

const userSchema = new DataBase.Schema({
	name: {
		full: {
			type: String
		}
	},
	user_id: String,
	role: {
		type: String,
		enum: ['admin','employee'],
		default: 'employee'
	},
	address: {
		flat_no: {type: String, default: ''},
		street_name: {type: String, default: ''},
		area: {type: String, default: ''},
		city: {
			name: {type: String, default: ''},
			code: {type: String, default: ''}
		},
		state: {
			name: {type: String, default: ''},
			code: {type: String, default: ''}
		},
		pincode: {type: String, default: ''}
	},
	dob: {type: Date},
	gender: {
		type: String,
		enum: ['male', 'female', 'others'],
		required: true
	},
	phone: {
		national_number: {type: String, required: true},
		country_code: {type: String, default: '91'},
		is_verified: {type: Boolean, default: false}
	},
	email: {
		primary: {type: String, default: ''},
		is_verified: {type: Boolean, default: false}
	},
	position: {type: String, default: ''},
	password: {
		type: String
	},
	status: {type: String, default: 'active'},
});

userSchema.plugin(Timestamps);
userSchema.plugin(mongooseDelete, {overrideMethods: 'all'});
const UserModel = DataBase.model('users', userSchema);

module.exports = UserModel;
