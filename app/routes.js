var crypto = require('crypto');
var express = require('express');
var basicAuth = require('basic-auth-connect')
module.exports = function(app) {
  var admin = require('./controllers/admin_controller');
  app.use('/static', express.static('./static')).
      use('/lib', express.static('../lib')
  );
  var auth = basicAuth(function(user, pass){
    return (user === 'waning' && pass === 'norway@123')
  })
  app.get('/admin', auth, function(req, res){
    res.render('admin')
  });
  app.get('/view/admin', function(req, res){
    res.render('admin-view')
  });

  app.get('/admin/getAllUsers', admin.getAllUsers);
  app.post('/admin/updateUsers', admin.updateUsers);
}