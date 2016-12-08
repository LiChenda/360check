var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var http = require('http');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var querystring = require('querystring');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
exports.login = function(req, res){
  User.findOne({username: req.body.username}).
    exec(function(err, doc){
      if(!doc){
        res.json('2');
      }else{
        var postData = querystring.stringify({
          id: req.body.username,
          pw:req.body.password
        })
        var option = {
          host: 'dian.hust.edu.cn',
          path: '/bbslogin',
          port: '81',
          method: 'POST',
          headers : {
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
          }
        };
        var request = http.request(option, function(response){
          var bufferHelper = new BufferHelper();
          response.on('data', function(chunk){
            bufferHelper.concat(chunk);
          })
          response.on('end', function(){
            // console.log(iconv.decode(bufferHelper.toBuffer(),'gb2312'));
            // console.log(iconv.decode(bufferHelper.toBuffer(),'gb2312').indexOf('错误! 密码错误!'));
            if(iconv.decode(bufferHelper.toBuffer(),'gb2312').indexOf('错误! 密码错误!')>-1){
              res.json(1)
            }else{
              req.session.regenerate(function(){
                req.session.username = doc.username;
                req.session.realname = doc.realname;
                // req.session.save();
                // console.log(req.session.username)
                res.json(0);
                // res.redirect('/main');
              });
            }
          })
        })
        // console.log(postData);
        request.write(postData)
        request.end();
      }
    })
  
};

exports.getRateList = function(req, res){
  // console.log(req.body.username)
  if(req.body.username!=req.session.username){
    res.json(3)
    return
  }
   var options = {
    host: '127.0.0.1',
    path: '/static/json/boss.json',
    port: '1337'
  }
  var captain;
  http.request(options, function(response){
    var jsondata = '';
    response.on('data',function(chunk){
      jsondata += chunk;
    });
    response.on('end', function(){
      captain = JSON.parse(jsondata).captain[0]['username'];
      if(req.body.username===captain){
        http.request({host:'127.0.0.1',path: '/static/json/config.json',port:'1337'},function(response){
          var config = '';
          response.on('data', function(chunk){
            config += chunk;
          });
          response.on('end', function(){
            var teams = [];
            var result = {};
            JSON.parse(config)['xmz'].forEach(function(v, i){
              if(v['leader']===req.body.username){
                teams.push(v['name'])
              }
            })
           teams.forEach(function(value, index){
              result[teams[index]] = [];
            })
            var count = 0;
            teams.forEach(function(value, index){
                  User.find({'score.content.teamName':teams[index]}).
                      exec(function(err, docs){
                        if(err){
                          console.log('Error: '+err);
                        }else{
                          // console.log(docs);
                          count += 1;
                          docs.forEach(function(v, i){
                            var t_score = [];
                            docs[i]['score'].forEach(function(v1, i1){
                              v1['content'].forEach(function(v2, i2){
                                if(v2['teamName']===teams[index]){
                                  v2['rateList'].forEach(function(v3, i3){
                                    if(v3['fromName']===req.body.username){
                                      t_score = v3['rateScore'];
                                    }
                                  })
                                }
                              })
                            })
                            result[teams[index]].push({
                              username: docs[i]['username'],
                              realname: docs[i]['realname'],
                              score: t_score
                            })

                          })
                          if(count==teams.length){
                            // console.log(result);
                            res.json(result)
                          }
                        }

                      })
              })
          })
        }).end()
      }else{
        User.findOne({username:req.body.username}).
          exec(function(err, doc){
            if(err){
              res.json({status:1, msg:'该用户不在考核名单'})
            }else{
              // findTeamMemberExceptOne('xmz', 'Norway组', 'waning')
              var teams = getKeys(doc);
              console.log(teams)
              var result = {};
              teams.forEach(function(value, index){
                result[teams[index]] = [];
              })
              var count = 0;
              teams.forEach(function(value, index){
                  User.find({'score.content.teamName':teams[index]}).
                      exec(function(err, docs){
                        if(err){
                          console.log('Error: '+err);
                        }else{
                          // console.log(docs);
                          count += 1;
                          docs.forEach(function(v, i){
                            var t_score = [];
                            docs[i]['score'].forEach(function(v1, i1){
                              v1['content'].forEach(function(v2, i2){
                                if(v2['teamName']===teams[index]){
                                  v2['rateList'].forEach(function(v3, i3){
                                    if(v3['fromName']===req.body.username){
                                      t_score = v3['rateScore'];
                                    }
                                  })
                                }
                              })
                            })
                            result[teams[index]].push({
                              username: docs[i]['username'],
                              realname: docs[i]['realname'],
                              score: t_score
                            })

                          })
                          if(count==teams.length){
                            // console.log(result);
                            res.json(result)
                          }
                        }

                      })
              })

            }
          })
      }
    })
  }).end()
  
    function getKeys(obj){
        var result = [];
        obj['score'].forEach(function(value, index){
          obj['score'][index]['content'].forEach(function(v, i){
            result.push(v['teamName']);
          })
        })
        return result;
      }
    
}

exports.getImpression = function(req, res){
  if(req.body.username!=req.session.username){
    res.json(3)
    return
  }
  var options = {
    host: '127.0.0.1',
    path: '/static/json/boss.json',
    port: '1337'
  }
  var captain;
  http.request(options, function(response){
    var jsondata = '';
    response.on('data',function(chunk){
      jsondata += chunk;
    });
    response.on('end', function(){
      captain = JSON.parse(jsondata).captain[0]['username'];
      // console.log(captain);
      User.findOne({username:captain}).
        exec(function(err, doc){
          if(err){
            console.log('Error: '+err);
          }else{
            if(doc){
              var f = false;
              var impressionScore = [];
              doc.impression.forEach(function(v, i){
                if(v['fromName']===req.body.username){
                  f = true;
                  impressionScore.push(v['score'])
                  return false
                }
              })
              res.json({impression: impressionScore});
            }
          }
        })
    })
  }).end()
  // User.findOne()
}
exports.writeScore = function(req, res){
  // console.log(req.session.username)
  if(req.body.fromName!=req.session.username){
    res.json(3)
    return;
  }
  User.findOne({'username':req.body.toName}).
    exec(function(err, doc){
      if (err) {
        console.log('Error: '+err);
      }else{
        if(doc){
          // console.log(JSON.stringify(doc))
          // console.log('1')
          var f = false;
          doc['score'].forEach(function(v, i){
            if(v['partName']===req.body.partName){
              // console.log('2')
              v['content'].forEach(function(v1, i1){
                if(v1['teamName']===req.body.teamName){
                  // console.log(v1['rateList'].length)
                  v1['rateList'].forEach(function(v2, i2){
                    if(v2['fromName']===req.body.fromName){
                      console.log(v2['fromName'])
                      doc['score'][i]['content'][i1]['rateList'][i2]['rateScore']=req.body.score;
                      f = true;
                      doc.save(function(err){
                        if(!err){
                          console.log('updated')
                          res.json(0);
                        }
                      })
                      
                    }
                  })
                  if(!f){
                    console.log('if')
                    doc['score'][i]['content'][i1]['rateList'].push({
                      fromName: req.body.fromName,
                      rateScore: req.body.score
                    })
                    doc.save(function(err){
                      if(!err){
                        console.log('insert')
                        res.json(0)
                      }
                    })
                  }
                }
              })
            }
          })
        }else{
          console.log('not found')
        }
      }
    })
}
exports.writeImpression = function(req, res){
  if(req.body.fromName!=req.session.username){
    res.json(3)
    return;
  }
  User.findOne({username:req.body.toName}).
    exec(function(err, doc){
      if(err){
        console.log("Error: "+err);
      }else{
        if(doc){
          var f = false;
          doc.impression.forEach(function(v, i){
            if(doc.impression[i]['fromName']===req.body.fromName){
              f = true
              doc.impression[i]['score'] = req.body.score
              return false;
            }
          })
          if(!f){
            doc.impression.push({
              fromName: req.body.fromName,
              score: req.body.score,
              identity: req.body.identity
            })
          }
          doc.save(function(err){
            console.log('save err')
            res.json(0)
          })
        }
      }
    })
}

exports.getImpressionForCaptain = function(req, res){
  if(req.body.username!=req.session.username){
    res.json(3)
    return;
  }
  http.request({host:'127.0.0.1',path:'/static/json/config.json',port:'1337'},function(response){
    var config = '';
    response.on('data', function(chunk){
      config += chunk;
    })
    response.on('end', function(){
      // var teams = [];
      var result = [];
      // JSON.parse(config)['xmz'].forEach(function(v, i){
      //   teams.push(v['name']);
      // })
      config = JSON.parse(config);
      // console.log(teams)
      // teams.forEach(function(value, index){
      //     result[teams[index]] = [];
      //   })
      User.find({'username':{$ne: req.body.username}}).
        exec(function(err, docs){
          if(err){
            console.log('Error: '+ err);
          }else{
            if(docs){
              // console.log(docs.length)
              docs.forEach(function(v, i){
                var person = {
                  username: docs[i]['username'],
                  realname: docs[i]['realname'],
                  xmz: [],
                  dwh: [],
                  zzb: [],
                  score: []
                };
                v['score'].forEach(function(v1, i1){
                    v1['content'].forEach(function(v2, i2){
                      person[v1['partName']].push(v2['teamName'])
                    })
                })
                v['impression'].forEach(function(v1, i1){
                  if(v1['fromName']===req.body.username){
                    person['score'].push(v1['score'])
                  }
                })
                // console.log(person)
                if(person['xmz'].length){
                  result.push(person);
                }
              })
              res.json(result);
            }
          }
        })
      
    })
  }).end()
}

exports.getImpressionForTutor = function(req, res){
  if(req.body.username!=req.session.username){
    res.json(3)
    return;
  }
  http.request({host:'127.0.0.1',path:'/static/json/config.json',port:1337},function(response){
    var config = '';
    response.on('data', function(chunk){
      config += chunk;
    })
    response.on('end', function(){
      config = JSON.parse(config);
      var names = [];
      var result = [];
      config['xmz'].forEach(function(v, i){
        if(v['leader']!=''&&names.indexOf(v['leader'])=== -1){
            names.push(v['leader'])
          }
      })
      config['dwh'].forEach(function(v, i){
        if(v['leader']!=''&&names.indexOf(v['leader'])=== -1){
            names.push(v['leader'])
          }
      })
      var count = 0;
      names.forEach(function(v, i){
        var person = {
          username: v,
          realname: '',
          xmz: [],
          dwh: [],
          score: []
        }
        config['xmz'].forEach(function(v1, i1){
          if(v1['leader']===v){
             person['realname'] = v1['leaderName'];
             person['xmz'].push(v1['name'])
          }
        })
        config['dwh'].forEach(function(v1, i1){
          if(v1['leader']===v){
             person['realname'] = v1['leaderName'];
             person['dwh'].push(v1['name'])
          }
        })
        User.findOne({username: v}).
          exec(function(err, doc){
            if(err){
              console.log('Error: '+err)
            }else{
              if(doc){
                doc['impression'].forEach(function(v2, i2){
                  if(v2['fromName']===req.body.username){
                    person['score'].push(v2['score'])
                    return false
                  }
                })
                count += 1;
                result.push(person);
                if(count==names.length){
                  res.json(result)
                }
              }
            }
          })
      })
    })
  }).end()
}

exports.getAllScore = function(req, res){
  User.find().
    exec(function(err, docs){
      if(err){
        console.log('Error: '+err)
      }else{
        var result = [];
        docs.forEach(function(v, i){
          var t_score = [];
          docs[i]['score'].forEach(function(v1, i1){
            if(v1['partName']==='xmz'){
              v1['content'].forEach(function(v2, i2){
                v2['rateList'].forEach(function(v3, i3){
                  if(v3['fromName']!=v['username']){
                    t_score.push(v3['rateScore']);
                  }
                })
              })
            }
          })
          if(t_score.length>0){
            result.push({
              username: docs[i]['username'],
              realname: docs[i]['realname'],
              score: t_score          })
          }
        })
        // console.log(result)
        res.json(result);
      }
    })
}
