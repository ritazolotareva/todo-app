// array is for function to save data of task list 
let tasksList = [];
// this variable is for to keep information in every html page
let listName = '';

// function that will be used to render title on pages later (in createTodoApp())
function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

// creating html elements and adding classes to them to render them on pages 
// there are input form, buttons, div
function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Enter new item';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Add item';
// disabling the main button by default
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

// condition that enable the main button 'Add item' while the input is not empty
    input.addEventListener('input', function () {
        if (input.value !== '') {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    })

    return {
        form, input, button
    }
}

// function that creates list of tasks will be used later in createTodoApp to append list on html page
function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

// creating html elements with added css classes
// the function creates task item with name and two buttons (done & delete)
// here also uses a function saves data to LocalStorage
function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div')
    let doneButton = document.createElement('button')
    let deleteButton = document.createElement('button')

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-center');
    item.textContent = obj.name;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Done';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';

    // this condition change status of obj's property
    if (obj.done == true) item.classList.add('list-group-item-success');

    doneButton.addEventListener('click', function () {
        item.classList.toggle('list-group-item-success');
        for (const listItem of tasksList) {
            if (listItem.id === obj.id) {
                listItem.done = !listItem.done;
            }
        }
        saveToLocalStorage(tasksList, listName);
    });

    deleteButton.addEventListener('click', function () {
        if (confirm('Are you sure?')) {
            item.remove();
            for (let i = 0; i < tasksList.length; ++i) {
                if (tasksList[i].id === obj.id) {
                    tasksList.splice(i, 1);
                }
            }
        }
        saveToLocalStorage(tasksList, listName);
    })

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
        item, doneButton, deleteButton,
    }
}

// setting todo app on html page itself with everything: title, todo form (input field and 'add' button), and etc.
function createTodoApp(container, title = 'To Do List', keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    listName = keyName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // rendering data from LocalStorage on page
    let localData = localStorage.getItem(listName);
    if (localData !== null && localData !== '') tasksList = JSON.parse(localData)
    for (const itemList of tasksList) {
        let todoItem = createTodoItem(itemList);
        todoList.append(todoItem.item);
    }

    // event 'submit' allows to confirm text in input without clicking the 'add' button on page, but just with tabbing the enter
    // function(e) stops automatic page relode
    todoItemForm.form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!todoItemForm.input.value) {
            return;
        }

        // adding properties in object of every item in the task list to identify it
        let newItem = {
            id: getNewID(tasksList),
            name: todoItemForm.input.value,
            done: false,
        } 
        let todoItem = createTodoItem(newItem);

        tasksList.push(newItem);
        saveToLocalStorage(tasksList, listName);

        // first adding task in the list
        todoList.append(todoItem.item);
        todoItemForm.button.disabled = true;
        // to empty input after adding a task
        todoItemForm.input.value = '';
    });
}


function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
        if(item.id > max) {
            max = item.id
        }
    }
    return max+1
}

function saveToLocalStorage(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr))
}


window.createTodoApp = createTodoApp;