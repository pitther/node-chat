var http = require("http");
var express = require('express');
var app = express();
var server = app.listen(8080);

app.use(express.static('public'));

console.log('Server: Listening on :8080');

var socket = require('socket.io');

var io = socket(server);

var jsonfile = require('jsonfile');

io.sockets.on('connection', newConnection);

var adminKey = "^iD2g26q80*F";

function newConnection(socket){
  console.log(socket.id + ' connected');
  socket.on('auth-req', auth);
  socket.on('reg', userExist);
  socket.on('msg', msg);
  socket.on('set-set', apply_settings);
  socket.on('user-on-of', user_on_of);


  socket.on('test-req', function (data){
    console.log(data);
  });

  function user_on_of(data){
    var file = 'data/online.json',
        unexist = true,
        str_ = '';
    console.log('on_of '+data.s_);
    jsonfile.readFile(file, function(err, obj) {
      for(i in obj.Online){
        str_ += obj.Online[i].name +' ';
        if (data.name == obj.Online[i].name){
          unexist = false;
        }
      }
      if (!data.s_){
        for(i in obj.Online){
           if(data.name == obj.Online[i].name){
            obj.Online.splice(i, 1);
            break;
          }
        }
      }
      if (unexist && data.s_){
        var data_ = {
          name: data.name
        }
        obj.Online.push(data_);
      }
      jsonfile.writeFile(file, obj, function (err) {
      });
    });
  }

  function auth(data){
    var log = false;
    var data_ = {
      log: false
    };
    var file = 'user.json';
    jsonfile.readFile(file, function(err, obj) {
      for(i in obj.User){
        if (data.name == obj.User[i].name && data.password == obj.User[i].password){
          log = true;
          obj.User[i].log = log;
          if (obj.User[i].admin == adminKey){
            obj.User[i].admin = '';
          }
          break;
        }
      }
      //console.log(data.name+' logined in');
      io.sockets.connected[socket.id].emit('auth-res', obj.User[i]);
      loadString(socket);
    });
  }

  function apply_settings(data){
    console.log('settings '+data.img);
    if (data.img.match(/\.(jpeg|jpg|gif|png)$/) != null){
      var file = 'user.json';
      jsonfile.readFile(file, function(err, obj){
        for(i in obj.User){
          if (data.id == obj.User[i].uid){
            obj.User[i].img = data.img;
          }
        }
        jsonfile.writeFile(file, obj, function (err) {});
      });
    }
  }

  function msg(data){
      if (messageValid(data.text)){
        data.text = urlify(data.text);
        console.log(data.text);
        socket.emit('msg', data);
        socket.broadcast.emit('msg', data);
        saveString(data);
      }
  }

  function reg(data){
    if (data.new){
      data.uid = makeid(5);
      var file = 'user.json';
      jsonfile.readFile(file, function(err, obj){
        delete data.new;
        obj.User.push(data);
        var fs = require('fs');
        jsonfile.writeFile(file, obj, function (err) {
          console.log(data.name+' registered');
          auth(data);
        });

        return true;
      });
    }
  }

  function userExist(data){
    var file = 'user.json';
    jsonfile.readFile(file, function(err, obj) {
      for(i in obj.User){
        if (data.name == obj.User[i].name){
          return true;
        }
      }
      data.new = true;
      reg(data);
      return false;
    });
  }

}

function loadString(socket) {
  var file = 'data/msg.json';
  jsonfile.readFile(file, function(err, obj) {
    for(i in obj.Messages){
      var data = obj.Messages[i];
      data.loadMsg = true;
      socket.emit('msg', data);
    }
  });
}

function saveString(data) {
  var file = 'data/msg.json';
  jsonfile.readFile(file, function(err, obj) {
    //obj.Messages[obj.Messages.length].push("text : "+data.text);
    obj.Messages.push(data);
    var fs = require('fs');
    jsonfile.writeFile(file, obj, function (err) {
    })
  });

}

function makeid(len_){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len_; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function messageValid(text_){
  if (text_ == '' || text_.includes('<') || text_.includes('>')){
    return false;
  } else {
    return true;
  }
}

function urlify(text) {
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    url = text;
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.bmp') || url.includes('.jpeg')){
      var  imgT = '<img alt="Не удалось загрузить картинку" class="msg_img" src="'+url+'"></img>';
      return '<a class="msg_img" target="_blank" href="' + url + '">' + imgT + '</a>';
    } else if (url.includes('https://www.youtube.com/watch?v=')){
      return '<object data="https://www.youtube.com/embed/'+url.slice(32)+'" allowfullscreen="true" width="100%" height="344"></object>';
    } else {
    return text.replace(urlRegex, function(url) {
      var noHref = '',
          imgT = '';
      if (!url.includes('http')) noHref = 'http://';
      return '<a target="_blank" href="'+noHref+'' + url + '">' + url + '</a>';
    });
  }
}
