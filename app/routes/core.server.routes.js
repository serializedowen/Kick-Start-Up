'use strict';

module.exports = function(app) {
  // Root routing
  var core = require('../../app/controllers/core.server.controller');
  app.route('/').get(core.index);
  app.route('/admin').post(core.loginAdmin);
  app.route('/search/:keyword').put(core.search);
};