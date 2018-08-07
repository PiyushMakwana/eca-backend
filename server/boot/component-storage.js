'use strict';

module.exports = function storage(app) {
  var storage = require('component-storage/lib');

  var options = {
    // custom user model
    userModel: 'Users', // specify your custom user model

    // Data source for metadata persistence
    dataSource: app.dataSources.mysqldb,
    keepAspectRatio: false,
    cropCenter: true,
    thumbnails: [
      {
        width: 120,
        height: 120,
      },
      {
        width: 180,
        height: 180,
      },
    ],
  };
  app.set('component-storage', options);
  storage(app, options);
};
