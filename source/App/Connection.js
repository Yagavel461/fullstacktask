/* eslint-disable no-console,no-useless-catch */
const DB = require('./MongooseConnection').create();
const Config = require('./Config');
const DBUrl = Config.DB_URL;

const DBConnection = {
	establish: async (Express) => {
		return await new Promise((resolve) => {
			let DBCheck = false;

			DB.set('strictQuery', true);
			try {
				DB.connect(DBUrl.ORGANIZATION, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Database connection established');
				DBCheck = true;
			} catch (error) {
				throw error;
			}
			DB.set('debug', true);

			resolve([DBCheck]);
		})
			.then(() => {
				Express.listen('4000', () => {
					console.log('server is running in 4000');
				});
			})
			.catch((error) => {
				throw error;
			});
	},
	/**
	 * To Get Organization DB Connection
	 * @returns {*}
	 */
	getAdminDBConnection: () => {
		return DB;
	}
};

module.exports = DBConnection;
