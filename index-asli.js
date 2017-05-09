var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//var clients = 0;
var users = [];
io.on('connection', function(socket){
	//io.emit('chat message', 'a user connected');
	console.log('a user connected');
	
	socket.on('setUsername', function(data){
    console.log(data);
	console.log(users.indexOf(data));
    if(users.indexOf(data) > -1){
		  socket.emit('userExists', data + ' username is taken! Try some other username.');
		}
		else{
		  users.push(data);
		  socket.emit('userSet', {username: data});
		}
	});
	socket.on('msg', function(data){
		  //Send message to everyone
		  io.sockets.emit('newmsg', data);
	})
  
	//broadcast message
	// clients++;
	// io.sockets.emit('broadcast',{ 
		// description: clients + ' clients connected!'
	// });

	// socket.on('disconnect', function(msg){
		// clients--;
		// io.sockets.emit('broadcast',{ 
			// description: clients + ' clients connected!'
		// });
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