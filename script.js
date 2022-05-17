let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));


//Selectors
const todoInput = document.querySelector('.todo-input input');
const todoList = document.querySelector('.todo-list');
const filters = document.querySelectorAll('.filters span');
const clearAll = document.querySelector('.clear-btn');


filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add('active');
        showTodo(btn.id);
    })
})


//Functions
function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                 li += `<li class="todo">
            <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id="${id}">
                <p class="${isCompleted}">${todo.name}</p>
            </label>
            <div class="settings">
                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                <ul class="task-menu"> 
                    <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pencil"></i>Edit</li>
                    <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash-can"></i>Delete</li>
            </ul>
            </div>
        </li>`;
            }
        }) // originally .task-menu has scale(0). .show transform it to scale(1)
    }
    todoList.innerHTML = li || `<span>You don't have any tasks here</span>`;
}

showTodo("all");

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', e => {
        if(e.target != selectedTask) { //remove show class when clicked on the document
            taskMenu.classList.remove('show');
        }
    })
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild; // = todo.name
    if(selectedTask.checked) {
        taskName.classList.add('checked');
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove('checked');
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    todoInput.value = taskName;
    todoInput.focus();
    todoInput.classList.add("active");
}

function deleteTask(deleteID) {
    // isEditedTask = false;
    todos.splice(deleteID, 1); //removing all tasks from array todos
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo('all');
}

clearAll.addEventListener('click', () => {
    todos.splice(0, todos.length); //removing selected task from array todos
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo('all');
} )


//Event Listeners
todoInput.addEventListener('keyup', e => {
    let userTask = todoInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditedTask) {
            if(!todos) { // if todos doens't exist, pass an empty array to todos
                todos =[];
            }
            let taskInfo = {name: userTask, status: "pending"}; //By default task status will be pending
            todos.push(taskInfo); //adding new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        todoInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo('all');
    }
})