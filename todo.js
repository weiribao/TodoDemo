var socket = io.connect();

function TodoCtrl($scope){
	$scope.todos = [];
	getTodos();

	$scope.addTodo = function(){
		console.log($scope.todoDue);
		var todo = new Todo($scope.todoText, $scope.todoDue);
		$scope.todos.push(todo);
		$scope.todoText = "";
		saveTodo(todo);
	};

	$scope.pending = function(){
		return $scope.todos.filter(function(todo){
			return !todo.done;
		})
	}

	$scope.finished = function(){
		return $scope.todos.filter(function(todo){
			return todo.done;
		})
	}

	$scope.archive = function(todo){
		todo.done = true;
		saveTodo(todo);
	}

	$scope.getDate = function(todo){
		return todo.due ? moment(todo.due).format("M/D/YY") : "";
	}

	$scope.isOverDue = function(todo){
		return todo.due < new Date;
	}

	function getTodos(todos){
		console.log("getTodos");
		socket.emit("todos");
		socket.on("todos", function(data){
			console.log("todos received.",data);
			$scope.$apply(function(){
				data.forEach(function(todo){
					$scope.todos.push(todo);
				})
			});
	
		});
	}

	function saveTodo(todo){
		socket.emit("todo", todo);
	}
}

function Todo(text, due){
	this.id = GUID();
	this.text = text;
	this.done = false;
	this.due = Date.parse(due)+(new Date).getTimezoneOffset()*60*1000;
}

function GUID(){
    var S4 = function(){
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };
    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
}