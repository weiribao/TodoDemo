var express = require('express'),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

var db = require("./db.js");

app.configure(function() {
    app.use(express.static(__dirname));
    app.use(express.directory(__dirname));
});

//
// communicates with client via socket.io
//
function runProtocol(socket){
	// return list of todos
	socket.on("todos", function(){
		db.getTodos(function(err, todos){
			if(!err){
				socket.emit("todos", todos);	
			}
		})
	});
	
	// create/update todo
	socket.on("todo", function(todo){
		var p_todo = {};
		for(var key in todo){
			if(key[0]!=="$"){
				p_todo[key]=todo[key];
			}
		}
		db.saveTodo(p_todo);
	})

	// remove todo
	socket.on("todo:remove", function(todo){
		db.removeTodo({_id: todo._id});
	})
}

db.run(function(){
	io.sockets.on("connection", runProtocol);
	server.listen(8000);
});
