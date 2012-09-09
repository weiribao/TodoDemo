var socket = io.connect();

function TodoCtrl($scope){
	$scope.todos = [];
	getTodos();

	$scope.addTodo = function(){
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

	$scope.remove = function(todo){
		var i=0;
		while(i<$scope.todos.length){
			if($scope.todos[i]._id === todo._id){
				break;
			} else{
				i++;
			}
		}
		$scope.todos.splice(i, 1);
		removeTodo(todo);
	}

	$scope.getDate = function(todo){
		return todo.due ? moment(todo.due).format("M/D/YY") : "";
	}

	$scope.isOverDue = function(todo){
		return todo.due < new Date;
	}

	function getTodos(todos){
		socket.emit("todos");
		socket.on("todos", function(todos){
			$scope.$apply(function(){
				todos.forEach(function(todo){
					$scope.todos.push(todo);
				})
			});
	
		});
	}

	function saveTodo(todo){
		socket.emit("todo", todo);
	}

	function removeTodo(todo){
		socket.emit("todo:remove", todo);
	}
}

function Todo(text, due){
	this._id = GUID();
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