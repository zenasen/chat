var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//var clients = 0;
var contacts = [];
var data_chat =[];


io.on('connection', function(socket){
	function get_id_by_username(username){
		for(var i =0 ; i < contacts.length; i++){
			if(username == contacts[i].nama){
				target_user_id = contacts[i].id;
				return target_user_id;
				break;
			}
		}
	}
	
	socket.on('set_registrasi', function(data){
		
		/*for(var i = 0;i < contacts.length;i++){
			if(contacts[i].nama == data.uname){
				socket.emit('userSet', '{respon:gagal, msg:username sudah digunakan}');
				return;
			}
		}*/
		var datapost = {"key01":"value01"};
		$.ajax({
		  	type: "POST",
		  	url: "http://localhost:9999/php/login.php",
		  	data: {myData:datapost},
		  	success: function(data){
				console.log(data);
		  	},
		  	error: function(xhr, status, error){
		  		console.log(error);
		  	},
		  	
		});
		return;
		//insert to database
		//$.post( "test.php", function( data ) {
			//alert( "Data Loaded: " + data );
		//});
		//$.getJSON('http://localhost:9999/php/login.php?login=0&username='+data.uname+'&password='+data.pwd, function (json){  
	        //console.log(json)
	        //if(json['respon'] =='sukses'){
	          //login_username = uname;
	        //}else{
	          //myApp.alert('Wrong Username or Password');  
	        //}
      	//});



	})
	socket.on('setUsername', function(data){
		//console.log(users);
		for(var i = 0;i < contacts.length;i++){
			if(contacts[i].nama == data){
				socket.emit('userSet', '{respon:gagal, msg:username sudah digunakan}');
				return;
			}
		}
		
		//if(users.indexOf(data) > -1){
			//socket.emit('userSet', '{respon:gagal, msg:username sudah digunakan}');
		//}
		//else{
		var user = {};
		user.id = socket.id;
		user.nama = data;
		contacts.push(user);
		var msg = {};
		msg.respon = "sukses";
		msg.contacts = contacts;
		io.sockets.emit('userSet', msg);
			//io.sockets.emit('update_contact',msg);
		//}
		
	});
	socket.on('disconnect', function() {
		//console.log(contacts);
		for(var i=0; i < contacts.length; i++){
			if(contacts[i].id === socket.id){
				//delete contacts[i];
				contacts.splice(i, 1);
				break;
			}
		}
		//console.log(contacts);
		//this.io.emit('exit',this.users); 
		//clients--;
		//io.sockets.emit('broadcast',{ 
			//description: clients + ' clients connected!'
		//});
	});
	socket.on('msg', function(data){
		  io.sockets.emit('newmsg', data);
		  console.log(data);
	})
	socket.on('check_msg_history', function(data){
		
		/*var chat_message = {};
		chat_message.users=["asen","made"];
		chat_message.detail=[];
		chat_message.detail.push({"text":"this message one from asen", "from":"asen"});
		chat_message.detail.push({"text":"this message one from made", "from":"made"});*/
		//data_chat.push(chat_message);
		var username1 = data.username1;
		var username2 = data.username2;
		var datapos =-1;
		for(var i = 0 ; i < data_chat.length; i++){
			if(data_chat[i].users.indexOf(username1) > -1 && data_chat[i].users.indexOf(username2) > -1){
				datapos = i;
				break;
			}
		}
		var target_user_id=get_id_by_username(data.username2);
		socket.emit(target_user_id).emit('check_msg_history_return', data_chat[datapos]);
		//io.sockets.emit('check_message_return', chat_message);
		//var user_id1= data.chat_id1;
		//var user_id2= data.chat_id1;

	});
	
	socket.on('delete_single_message',function(data){
		var username1 = data.username1;
		var username2 = data.username2;
		var datapos =0;
		var messagedetalid = data.messagetextid;
		console.log(messagedetalid);
		for(var i = 0 ; i < data_chat.length; i++){
			if(data_chat[i].users.indexOf(username1) > -1 && data_chat[i].users.indexOf(username2) > -1){
				datapos = i;
				break;
			}
		}
		for(var i = 0 ; i < data_chat[datapos].detail.length;i++){
			if(data_chat[datapos].detail[i].id == messagedetalid){
				console.log(data_chat[datapos].detail[i]);
				data_chat[datapos].detail.splice(i, 1);
				break;
			}
		}
	});

	socket.on('private_message', function(data){

	
		var username1 = data.username1;
		var username2 = data.username2;
		var datapos =-1;
		var messagedetalid = 0;
		for(var i = 0 ; i < data_chat.length; i++){
			if(data_chat[i].users.indexOf(username1) > -1 && data_chat[i].users.indexOf(username2) > -1){
				datapos = i;
				break;
			}
		}
		if (datapos==-1){
			//var chat_message = {};
			//chat_message.users=[username1,username2];
			//chat_message.detail=[];
			//data_chat.push(chat_message);
			//data_chat[data_chat.length-1].detail.push({"text":data.messageText, "from":data.username1, "type2":data.type2, "id":0,});
		}else{
			//messagedetalid = data_chat[datapos].detail.length;
			//data_chat[datapos].detail.push({"text":data.messageText, "from":data.username1, "type2":data.type2, "id":messagedetalid});
		}
		var target_user_id = get_id_by_username(data.username2);

		var data_send = {};
		data_send.username1 = username1;
		data_send.messagetext = data.messageText;
		data_send.type2 = data.type2;
		data_send.id = messagedetalid;
		
		socket.broadcast.to(target_user_id).emit('private_message_receive', data_send);
	});
  
	//broadcast message
	// clients++;
	// io.sockets.emit('broadcast',{ 
		// description: clients + ' clients connected!'
	// });

	
	
	//msg from server to client
	// setTimeout(function(){
		//socket.send('Sent a message 4seconds after connection!');
		//--custom event
		//socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
	// }, 4000);
	
	// socket.on('chat message', function(msg){
		// io.emit('chat message', msg);
		// //console.log('message: ' + msg);
	// });
   
	// socket.on('clientEvent', function(data){
		// console.log(data);
	// });
});

//custom name space
// var nsp = io.of('/my-namespace');
// nsp.on('connection', function(socket){
  // console.log('someone connected');
  // nsp.emit('hi', 'Hello everyone!');
// });



http.listen(3001, function(){
  console.log('listening on *:3001');
});