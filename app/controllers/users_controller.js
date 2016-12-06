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
            User.find({$and:[{'score.content.teamName':teams[index]},{'username':{$ne: doc.username}}]}).
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

exports.writeScore = function(req, res){
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

exports.getAllScore = function(req, res){
  console.log('ss')
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
                  t_score.push(v3['rateScore']);
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
        console.log(result)
        res.json(result);
      }
    })
}
