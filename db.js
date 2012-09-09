var mongo = require("mongodb");
var todosCollection;

exports.run = function(callback){
	var mongoServer = new mongo.Server("localhost", 27017, {auto_reconnect: true}),
		db = new mongo.Db("todosDemo", mongoServer);
	db.open(function(err, db){
		if(!err){
			db.collection("todos", function(err, collection){
				if(!err){
					todosCollection = collection;
					callback();
					db.close();
				} else {
					db.close();
					throw err;
				}
			});
		} else {
			db.close();
			throw err;
		}
	})
}

exports.getTodos = function(callback){
	todosCollection.find().toArray(callback);
}

exports.saveTodo = function(todo){
	todosCollection.save(todo);
}

exports.removeTodo = function(todo){
	todosCollection.remove(todo);
}