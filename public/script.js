var inFormOrLink,
    socket,
    user,
    reg,
    newMessage,
    newOnline,
    verify_auth,
    register,
    loginSucc,
    loginFailed,
    apply_settings;

$('a').on('click', function() { inFormOrLink = true; });
$('form').on('submit', function() { inFormOrLink = true; });

$(window).on("beforeunload", function() {
  if (user.log){
    user.online(false);
  }
});

window.onload = function() {
  //var player = new MediaElementPlayer('#player1');
  elem.loader.style.display = "none";
  document.getElementsByTagName("BODY")[0].style.background = "url(content/bg/shattered.png)";
  elem.content.style.display = "block";
  $('[data-toggle="tooltip"]').tooltip();
  socket.on('auth-res', auth_res);
  socket.on('new-online', newOnline);
  socket.on('msg', newMessage);
  function auth_res(data){
    user.log = data.log;
    if (user.log){
      user.img = data.img;
      user.name = data.name;
      user.id = data.uid;
      user.loginSucc();
      if ( typeof( data.admin ) != "undefined"){
        document.getElementById("btn_admin").style.display = "inline-block";
      }
      return true;
    }else{
      user.loginFailed();
      return false;
    }
  }
  open_auth_modal();
};

socket = io.connect('http://localhost:8080/');

user = {
  log: false,
  online: function (s_){
    if (s_)
      user.log = true;
    else
      user.log = false;
    var data = {
      name: user.name,
      s_: s_
    }
    socket.emit('user-on-of', data);
  },
  exit_session: function (){
    user.online(false);
    delete user.id,
           user.name,
           user.img,
           user.log;
    prevId = undefined;
    $( ".messages" ).empty();
    open_auth_modal();
    return true;
  },
  loginSucc: function(){
    if (user.log){
      user.online(true);
      close_auth_modal();
    }
  },
  loginFailed: function(){
    document.getElementById("div1");
    document.getElementById("login-form").className += " has-error";
    document.getElementById("glyhp-err-1").style.display = "block";
    document.getElementById("glyhp-err-2").style.display = "block";
  }
}

newOnline = function(data){
    document.getElementById('ttp_online').title = data;
}

reg = function(data){
  user.id = data;
}

newMessage = function(data){
  if (user.log){
    if (data.id == user.id) {var dir = 'right'} else{ var dir = 'left'}
      sendMessage(data.text, dir, data.loadMsg, data.name, data.id, data.img);
  }
}



verify_auth = function(name_, password_){
  if (name_ != '' && password_ != ''){
    var data = {
      name : name_,
      password: password_
    }
    socket.emit('auth-req', data);
  }
}

register = function(){
    var data = {
      name : document.getElementById("usr").value,
      password : document.getElementById("pwd").value
    }
    socket.emit('reg', data);
}



apply_settings = function(){
  var data = {
    id: user.id
  };
  if(document.getElementById("set_url").value != ''){
    data.img = document.getElementById("set_url").value;
  }
  user.img = data.img;
  socket.emit('set-set', data);
  close_settings_modal();
}




//$('#content div.text:last')[0].innerText += '\r\n' + arg.text;
