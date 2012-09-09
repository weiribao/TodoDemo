var socket = io.connect();

function TodoCtrl($scope){
	$scope.todos = [];
	$scope.editMode = false;
	$scope.editTodo = {};

	getTodos();

	$scope.addTodo = function(){
		console.log($scope.todoDue);
		var todo = new Todo($scope.todoText, $scope.todoDue);
		$scope.todos.push(todo);
		$scope.todoText = "";
		saveTodo(todo);
	};

	$scope.edit = function(todo){
		console.log("edit");
		$scope.editTodo = todo;
		$scope.editMode = true;
		$scope.todoTextEdit = todo.text;
		$scope.todoDueEdit = numberToTime(todo.due);
	}

	$scope.saveEditTodo = function(){
		console.log("@@@", $scope.todoTextEdit);
		$scope.editTodo.text = $scope.todoTextEdit;
		$scope.editTodo.due = timeToNumber($scope.todoDueEdit);
		saveTodo($scope.editTodo);
		$scope.editMode = false;
		$scope.editTodo = {};
	}

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
	this.due = timeToNumber(due);
}

function timeToNumber(time){
	return Date.parse(time)+(new Date).getTimezoneOffset()*60*1000
}

function numberToTime(number){
	return moment(number).format("YYYY-MM-DD");
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