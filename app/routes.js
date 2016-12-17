var crypto = require('crypto');
var express = require('express');
var basicAuth = require('basic-auth-connect')
module.exports = function(app) {
  var admin = require('./controllers/admin_controller');
  var user = require('./controllers/users_controller');
  app.use('/static', express.static('./static')).
      use('/lib', express.static('../lib')
  );
  var auth = basicAuth(function(user, pass){
    return (user === 'waning' && pass === 'norway@123')
  })
  app.get('/',function(req, res){
    res.redirect('/main')
  })
  /** admin **/
  app.get('/admin', auth, function(req, res){
    res.render('admin')
  });
  app.get('/view/admin', function(req, res){
    res.render('admin-view')
  });

  app.get('/admin/getAllUsers', admin.getAllUsers);
  app.post('/admin/updateUsers', admin.updateUsers);
  app.post('/admin/removeScore', admin.removeScore);

  /**  360check  **/
  app.get('/main', function(req, res){
    console.log(req.session.username)
    res.render('main', {username: req.session.username, 
                        realname: req.session.realname});
  })
  app.get('/login', function(req, res){
    if(req.session.username){
      res.redirect('/main')

    }else{
      res.render('login')
    }
  })
  app.post('/login', user.login);
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/main')
    })
  })
  app.post('/getRateList', user.getRateList);
  app.post('/getImpression', user.getImpression);
  app.post('/writeScore', user.writeScore);
  app.post('/writeImpression', user.writeImpression);
  app.get('/getAllScore', user.getAllScore);
  app.get('/getStars', user.getStars);
  app.get('/getFinalScore', user.getFinalScore);
  app.get('/getSeedScore', user.getSeedScore);

  app.post('/getImpressionForCaptain', user.getImpressionForCaptain);
  app.post('/getImpressionForTutor', user.getImpressionForTutor);

  app.get('/getNoRate', user.getNoRate);
}