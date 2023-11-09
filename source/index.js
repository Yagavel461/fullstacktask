/* eslint-disable no-unused-vars */
require('express-async-errors');
const Express = require('express');
const App = Express();
const Morgan = require('morgan');
const Helmet = require('helmet');
const UserAgent = require('express-useragent');
const BoolParser = require('express-query-boolean');
const Cors = require('cors');
const {isEmpty} = require('./Helpers/Utils');

// express configurations starting here.
App.use(Morgan('dev'));
App.use(Express.json());
App.use(Helmet());
App.use(BoolParser());
App.use(UserAgent.express());
App.use(
	Cors({
		origin: ['http://localhost:3000'],
		credentials: true
	})
);

/*----------------------------------------------------------------------------*/
// Routes Configurations
App.use('/api/sciflare/auth', require('./Routes/AuthRouter'));
App.use('/api/sciflare/user', require('./Routes/OrganizationRouter'));
/*----------------------------------------------------------------------------*/

require('./App/Connection')?.establish(App);
module.exports = App;
