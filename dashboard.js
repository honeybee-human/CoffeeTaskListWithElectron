    //  date constants
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const displayWeekDay = document.getElementById("day")
const displayDayNb = document.getElementById("number")
const displayMonth = document.getElementById("month")

const day = new Date()
let todayName = day.getDay()
let todayNumber = day.getDate()
let todayMonth = day.getMonth()

displayWeekDay.innerHTML = weekday[todayName]
displayDayNb.innerHTML = todayNumber
displayMonth.innerHTML = month[todayMonth]

    //  element constants
const addTaskBtn = document.getElementById("add-btn")
const inputTask = document.getElementById("write-task")
const taskListContainer = document.querySelector(".task-list-container")
const searchInput = document.getElementById("search-task")
let taskList = [];

const progressBarValue = document.getElementById("progress-bar")

    //  priority constants
const PRIORITY_COLORS = {
    high: '#ff6b6b',
    medium: '#ffd93d',
    low: '#6bff6b'
};

const PRIORITY_MARKS = {
    high: '!!!',
    medium: '!!',
    low: '!'
};

const PRIORITIES = ['high', 'medium', 'low'];

    //  finish button
const finishBtn = document.getElementById("finish-btn");
finishBtn.addEventListener("click", () => {
    console.log("Saving progress:", progressBarValue.value);
    localStorage.setItem("finalProgress", progressBarValue.value);
    window.electronAPI.loadPage("finishDay.html");
})

    //  snackbar for too many tasks or no task entered
function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = "show";
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

    //  format time for completion time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// TASK CRUD FUNCTIONS
// delete task
function deleteTask(index) {
    const taskElement = document.getElementById(`task${index + 1}`);
    if (taskElement) {
        taskElement.remove();
        taskList.splice(index, 1);
        const remainingTasks = taskListContainer.querySelectorAll("p");
        remainingTasks.forEach((task, i) => {
            task.id = `task${i + 1}`;
            task.querySelector("span").id = `text-task-${i + 1}`;
            task.setAttribute('data-index', i);
        });
        updateProgressBar();
    }
}

// edit task
function editTask(index) {
    // get the task span and current task
    const taskSpan = document.querySelector(`#text-task-${index + 1}`);
    const currentTask = taskList[index];
    
    // create edit container
    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";
    
    // create input for editing task text
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentTask.text;
    input.className = "edit-input";

    editContainer.appendChild(input);

    // create save edit function
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText) {
            taskList[index].text = newText;
            taskSpan.textContent = newText;
        }
        taskSpan.style.display = "";
        editContainer.remove();
    };

    // add event listeners for input blur and keydown
    input.addEventListener("blur", () => setTimeout(saveEdit, 200));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveEdit();
        } else if (e.key === "Escape") {
            taskSpan.style.display = "";
            editContainer.remove();
        }
    });

    // set task span to none and insert edit container before task span
    taskSpan.style.display = "none";
    taskSpan.parentNode.insertBefore(editContainer, taskSpan);
    input.focus();
}

// add new task
function addNewTask() {
    if (inputTask.value.trim() === "") {
        showSnackbar("Please enter a task before adding to the list.");
    } else if (taskList.length >= 7) {
        showSnackbar("Task list is full. You can only add up to 7 tasks.");
    } else {
        const newIndex = taskList.length;
        const newTask = {
            text: inputTask.value,
            completedAt: null,
            priority: 'medium'
        };
        taskList.push(newTask);
        const taskElement = createTaskElement(newTask.text, newIndex);
        taskListContainer.appendChild(taskElement);
        inputTask.value = "";
        updateProgressBar();
    }
}


// search tasks
function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const tasks = taskListContainer.querySelectorAll("p");
    
    tasks.forEach(task => {
        const taskText = task.querySelector("span").textContent.toLowerCase();
        const shouldShow = taskText.includes(searchTerm);
        task.style.display = shouldShow ? "" : "none";
    });
}



    // PRIORITY SECTION
    // add priority dropdown and set the default priority to medium, maybe low?
function createPriorityDropdown(index) {
    const dropdown = document.createElement('div');
    dropdown.className = 'priority-dropdown';
    
    // create button for priority dropdown
    const button = document.createElement('button');
    button.className = 'priority-btn';
    button.innerHTML = PRIORITY_MARKS[taskList[index].priority];
    button.style.color = PRIORITY_COLORS[taskList[index].priority];
    
    // create content div for priority dropdown
    const content = document.createElement('div');
    content.className = 'priority-dropdown-content';
    
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            content.classList.remove('show');
        }
    });
    
    // add event listener for priority dropdown button
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        // remove show class from all priority dropdown contents
        document.querySelectorAll('.priority-dropdown-content.show').forEach(dropdown => {
            if (dropdown !== content) {
                dropdown.classList.remove('show');
            }
        });
        content.classList.toggle('show');
        
        // get the position of the button and set the position of the content
        const rect = button.getBoundingClientRect();
        content.style.top = `${rect.bottom + 5}px`;
        content.style.left = `${rect.left}px`;
    });
    
    PRIORITIES.forEach(priority => {
        const option = document.createElement('button');
        option.className = 'priority-option';
        option.innerHTML = PRIORITY_MARKS[priority];
        option.style.color = PRIORITY_COLORS[priority];
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            taskList[index].priority = priority;
            button.innerHTML = PRIORITY_MARKS[priority];
            button.style.color = PRIORITY_COLORS[priority];
            const taskElement = document.getElementById(`task${index + 1}`);
            updateTaskPriorityStyle(taskElement, priority);
            content.classList.remove('show');
        });
        content.appendChild(option);
    });
    
    dropdown.appendChild(button);
    document.body.appendChild(content);
    
    return dropdown;
}


function updateTaskPriorityStyle(taskElement, priority) {
    taskElement.style.borderLeft = `4px solid ${PRIORITY_COLORS[priority]}`;
}

    // ADD ELEMENTS SECTION
// create task element
function createTaskElement(taskText, index) {
    // setup for task element with id, draggable, and data-index
    const taskElement = document.createElement("p");
    taskElement.id = `task${index + 1}`;
    taskElement.draggable = true;
    taskElement.setAttribute('data-index', index);

    // create task content
    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    // create coffee icon and set class
    const coffeeIcon = document.createElement("i");
    coffeeIcon.className = "bx bxs-coffee";

    // create text span containing the task text
    const textSpan = document.createElement("span");
    textSpan.id = `text-task-${index + 1}`;
    textSpan.textContent = taskText;

    // create time span containing the completion time
    const timeSpan = document.createElement("span");
    timeSpan.className = "completion-time";
    timeSpan.style.marginLeft = "8px";
    timeSpan.style.fontSize = "12px";
    timeSpan.style.color = "var(--color-accent)";

    // create actions div containing the checkbox, priority dropdown, edit button, and delete button
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // create checkbox for task completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", (event) => {
        textSpan.classList.toggle("done", event.target.checked);
        textSpan.classList.toggle("checked", event.target.checked);
        
        if (event.target.checked) {
            const completionTime = new Date();
            taskList[index].completedAt = completionTime;
            timeSpan.textContent = formatTime(completionTime);
        } else {
            taskList[index].completedAt = null;
            timeSpan.textContent = "";
        }
        
        updateProgressBar();
    });

    // create priority dropdown
    const priorityDropdown = createPriorityDropdown(index);

    // create edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="bx bx-edit-alt"></i>';
    editBtn.addEventListener("click", () => editTask(index));

    // create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="bx bx-trash"></i>';
    deleteBtn.addEventListener("click", () => deleteTask(index));

    // add task content pieces to task element
    taskContent.appendChild(coffeeIcon);
    taskContent.appendChild(textSpan);
    taskContent.appendChild(timeSpan);
    
    actionsDiv.appendChild(checkbox);
    actionsDiv.appendChild(priorityDropdown);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    taskElement.appendChild(taskContent);
    taskElement.appendChild(actionsDiv);

    // Set initial priority style
    updateTaskPriorityStyle(taskElement, taskList[index].priority);

    // Add drag and drop event listeners
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
    taskElement.addEventListener('dragover', handleDragOver);
    taskElement.addEventListener('drop', handleDrop);

    return taskElement;
}

let draggedTask = null;

// handle drag start setting dragged task variable, opacity and adding class
function handleDragStart(e) {
    draggedTask = this;
    this.style.opacity = '0.4';
    this.classList.add('dragging');
}

// handle drag end setting dragged task variable, returning opacity and removing class
function handleDragEnd(e) {
    this.style.opacity = '1';
    this.classList.remove('dragging');
    draggedTask = null;
}

// handle drag over preventing default behavior
function handleDragOver(e) {
    e.preventDefault();
    return false;
}

// handle drop preventing default behavior and checking if dragged task is the same as the dropped task
function handleDrop(e) {
    e.preventDefault();
    if (draggedTask === this) return;

    // get the index of the dragged task and the index of the dropped task
    const draggedIndex = parseInt(draggedTask.getAttribute('data-index'));
    const dropIndex = parseInt(this.getAttribute('data-index'));

    // remove the dragged task from the list and add it to the new position
    const [draggedItem] = taskList.splice(draggedIndex, 1);
    taskList.splice(dropIndex, 0, draggedItem);

    // insert the dragged task into the new position
    if (dropIndex < draggedIndex) {
        this.parentNode.insertBefore(draggedTask, this);
    } else {
        this.parentNode.insertBefore(draggedTask, this.nextSibling);
    }

    // update the task list container with the new task positions
    const tasks = taskListContainer.querySelectorAll('p');
    tasks.forEach((task, index) => {
        task.id = `task${index + 1}`;
        task.querySelector("span").id = `text-task-${index + 1}`;
        task.setAttribute('data-index', index);
    });
}

    // add event listeners for add task button, input task, and search input
addTaskBtn.addEventListener("click", addNewTask);

inputTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewTask();
    }
});

if (searchInput) {
    searchInput.addEventListener("input", filterTasks);
}

// update progress bar with checked tasks
function updateProgressBar() {
    const checkedElements = document.querySelectorAll(".checked");
    const checkedCount = checkedElements.length;
    const totalTasks = taskList.length;
    const progress = totalTasks > 0 ? (checkedCount / totalTasks) * 100 : 0;
    progressBarValue.value = progress;
}