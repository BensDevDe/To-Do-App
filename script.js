// Lists / Projects (ul in all-tasks, class = 'task-list-title)
const listsContainer = document.querySelector('[data-lists')
// add new list / Project (form)
const newListForm = document.querySelector('[data-new-list-form]')
// add new list / Project (input)
const newListInput = document.querySelector('[data-new-list-input]')


//************************************************ */


// list container (class = 'todo-list')
const listDisplayContainer = document.querySelector('[data-list-display-container]')


//task title and task count
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')


//tasks
const tasksContainer = document.querySelector('[data-tasks]')
// add new task (form)
const newTaskForm = document.querySelector('[data-new-task-form]')
// add new task (input)
const newTaskInput = document.querySelector('[data-new-task-input]')


// template task in html
const taskTemplate = document.getElementById('task-template')


//***************************************************** */



// delete list button
const deleteListButton = document.querySelector('[data-delete-list-button]')
// clear complete task
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks]')



//******************************************************* */


//local storage
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'



let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) ||[]
//selecting lists
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


//******************************************************** */

// addEventListener to create a new list-item
newListForm.addEventListener('submit', e =>  {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

// addEventListener to select list-items
listsContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})



//********************/


// addEventListener checkedtask
tasksContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

// addEventListener completed tasks delete
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

// addEventListener delete button
deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender();
})


// addeventListener new-task-form
newTaskForm.addEventListener('submit', e =>  {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

//create a new list
function createList(name) {
  return  {id: Date.now().toString(), name: name, tasks: [] }
}
// create a new task
function createTask(name) {
    return  {id: Date.now().toString(), name: name, complete: false }

}

//*********************************************** */

//save and render
function saveAndRender() {
    save()
    render()
}

//save
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

//render**********
function render() {
    //render list-container
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)

    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name
        //render task count
        renderTaskCount(selectedList)
        // render task-container
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

//render lists**********************+
function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if(list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}


//render tasks*************************
function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)

    })
}
// render task count
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks'
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`

}

//clear element************************
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();

// CLOCK*************************************************+

let clock = document.getElementById('clock');

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  clock.textContent = 
    ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
}

setInterval(time, 1000);

