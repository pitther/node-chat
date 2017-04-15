setTimeout(function () {
  //$("img").last().addClass("hide");
}, 100);
var elem,
    getMessageText,
    message_side,
    sendMessage;
    message_side = 'right';

elem = {
    content: document.getElementById('content'),
    user_img: document.getElementById('header_user_img'),
    user_name: document.getElementById('header_user_name'),
    user_profile_link: document.getElementById('header-profile-href'),
    loader: document.getElementById('loader_container'),
    user_info:{
      id: document.getElementById('user_id'),
      reg_date: document.getElementById('user_reg_date'),
      friends_cnt: document.getElementById('user_fri_cnt'),
      subs_cnt: document.getElementById('user_sub_cnt')
      }
    },
    prevId = '';

var Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
              var $message;
              //var prevId = 'GJ7Wm';
              if (_this.text.includes('https://www.youtube.com/embed/')){
                prevId = '';
              }
              if (prevId == arg.id){
                  //$('#content div.text:last')[0].innerText += '\r\n' + arg.text;
                  $('#content div.text:last')[0].innerHTML += "<br>" +_this.text;
              } else {
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $message[0].children[0].style.backgroundImage="url("+arg.img+")"
                $('.messages').append($message);
              }
              prevId = arg.id;
              if (_this.text.includes('https://www.youtube.com/embed/')){
                prevId = '';
              }
              if (typeof($message) != 'undefined'){
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
              }

        };
    }(this);
    return this;
};

getMessageText = function () {
          var $message_input;
          $message_input = $('.message_input');
          return $message_input.val();
      };

sendMessage = function (text, side, load, name, id, img) {
          var $messages, message;
          if (text.trim() === '') {
              return;
          }
          $messages = $('.messages');
          message_side = side;
          message = new Message({
              text: text,
              message_side: message_side,
              name: name,
              id: id,
              img: img
          });
          message.draw();
          if (load) {var delay = 0} else {var delay = 300}
          return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, delay);
      };

$('.send_message').click(function () {
    sendMessageToServer(getMessageText());
    $('.message_input').val('');
});
$('.message_input').keyup(function (e) {
    if (e.which === 13) {
        sendMessageToServer(getMessageText());
        $('.message_input').val('');
    }
});

function sendMessageToServer(msg_){
  var data = user;
  data.text = msg_;
  socket.emit('msg', data);
}

function open_auth_modal(){
  $('#auth_modal').modal({backdrop: 'static', keyboard: false});
  elem.content.className = "content-blured";
}

function close_auth_modal(){
  document.getElementById("glyhp-err-1").style.display = "none";
  document.getElementById("glyhp-err-2").style.display = "none";
  $('#auth_modal').modal('hide');
  elem.content.className += "content-clear";
}

function close_settings_modal(){
  $('#settings_modal').modal('hide');
  elem.content.className += "content-clear";
}

function open_settings_modal(){
  $('#settings_modal').modal({});
  elem.content.className += "content-clear";
}

function open_exit_modal(){
  $('#settings_modal').modal('hide');
  elem.content.className = "content-blured";
}

function close_exit_modal(s_){
  $('#exit_modal').modal('hide');
  elem.content.className += "content-clear";
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function httpGet(theUrl){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = this.responseText;
        jsonMSG = myArr;
    }
  };
  xmlhttp.open("GET", theUrl, true);
  xmlhttp.send();
}

function getXML(theUrl){
  var x = new XMLHttpRequest();
  x.open("GET", theUrl, true);
  x.onreadystatechange = function () {
  if (x.readyState == 4)
  {
    var doc = x.responseXML;
    console.log(doc);
  }
  };
  x.send();
}
