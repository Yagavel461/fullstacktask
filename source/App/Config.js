const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;

module.exports = {
	DB_URL: {
		ORGANIZATION: environment.DB_URL_ORGANIZATION || 'mongodb://localhost:27017/organisations'
	}
};
