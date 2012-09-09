var express = require('express'),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

app.configure(function() {
    app.use(express.static(__dirname));
    app.use(express.directory(__dirname));
});

var todos = [];

io.sockets.on("connection", function(socket){
	socket.on("todos", function(){
		socket.emit("todos", todos);
	});
	socket.on("todo", function(todo){
		console.log(todo);
		for(var i=0;i<todos.length;i++){
			if(todos[i].id===todo.id){
				todos[i]=todo;
				return
			}
		}
		todos.push(todo);
	})
})

server.listen(8000);