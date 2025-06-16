let todoList = [];
let todoListhtml = '';
console.log(todoList);
let currentSortMethod = 'date'; // Default sort method
let currentSortOrder = 'asc'; // Default sort order for priority
let currentCategorySortOrder = 'asc'; // Default sort order for category

let isEditing = false;
let editIndex = null;

let filterMethod = 'all';

// Add icon - for add action
const addIcon = document.createElement('i');
addIcon.classList.add('fa-solid', 'fa-add');

// Check icon - for update action
const checkIcon = document.createElement('i');
checkIcon.classList.add('fa-solid', 'fa-check');

// Display the remaining characters count out of 120
document.querySelector('.js-name-input').addEventListener('input', (e) => {
  let input = e.target.value;
  if (input.length === 120) {
    alert('max character limits exceeded');
  }
});

let dateCheck = false;
let timeCheck = false;

document.querySelector('.js-date-input').addEventListener('click', (e) => {
  e.preventDefault();
  if (!dateCheck) {
    e.target.showPicker();
    dateCheck = true;
  } else {
    dateCheck = false;
  }
});

document.querySelector('.js-date-input').addEventListener('blur', () => {
  dateCheck = false;
});

document.querySelector('.js-time-input').addEventListener('click', (e) => {
  e.preventDefault();
  if (!timeCheck) {
    e.target.showPicker();
    timeCheck = true;
  } else {
    timeCheck = false;
  }
});

document.querySelector('.js-time-input').addEventListener('blur', () => {
  timeCheck = false;
});

function clearInputs() {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  // Clear the inputs
  inputNameElement.value = '';
  inputDateElement.value = '';
  inputTimeElement.value = '';
  inputCategoryElement.value = '';
  inputPriorityElement.value = '';
  setDefaultDateTime();
}

const API_BASE_URL = 'http://localhost:8080/api/todos';

// 初始化加载数据
async function loadTodos() {
    try {
        const response = await fetch(API_BASE_URL);
        todoList = await response.json();
        updateTodoList();
        updateTaskCounter();
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

// 添加待办事项
async function addTodo() {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
    const inputCategoryElement = document.querySelector('.js-category-input');
    const inputPriorityElement = document.querySelector('.js-priority-input');

    let name = inputNameElement.value;
    let date = inputDateElement.value;
    let time = inputTimeElement.value;
    let category = inputCategoryElement.value;
    let priority = inputPriorityElement.value;

    if (!name || !date || !time || !category || !priority) {
        alert('请填写所有字段：任务、日期、时间、类别和优先级。');
        return;
    }

    if (date < inputDateElement.min) {
        alert('请选择当前日期或未来日期。');
        return;
    }

    if (time < inputTimeElement.min && date === inputDateElement.min) {
        alert('请选择未来时间。');
        return;
    }

    const todo = {
        name,
        date,
        time,
        category,
        priority,
        completed: false
    };

    try {
        if (isEditing) {
            const response = await fetch(`${API_BASE_URL}/${todoList[editIndex].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
            if (response.ok) {
                isEditing = false;
                editIndex = null;
                const addButton = document.querySelector('.js-add-button');
                addButton.innerHTML = '';
                addButton.title = '添加';
                addButton.appendChild(addIcon);
                const cancelEditBtn = document.querySelector('.js-cancel-button');
                cancelEditBtn.style.display = 'none';
            }
        } else {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
        }
        
        clearInputs();
        await loadTodos();
    } catch (error) {
        console.error('Error saving todo:', error);
    }
}

// 删除待办事项
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await loadTodos();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// 编辑待办事项
function editTodo(index) {
    let inputNameElement = document.querySelector('.js-name-input');
    let inputDateElement = document.querySelector('.js-date-input');
    let inputTimeElement = document.querySelector('.js-time-input');
    let inputCategoryElement = document.querySelector('.js-category-input');
    let inputPriorityElement = document.querySelector('.js-priority-input');

    const todo = todoList[index];
    inputNameElement.value = todo.name;
    inputDateElement.value = todo.date;
    inputTimeElement.value = todo.time;
    inputCategoryElement.value = todo.category;
    inputPriorityElement.value = todo.priority;

    isEditing = true;
    editIndex = index;

    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'block';

    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = '更新';
    addButton.appendChild(checkIcon);
}

function cancelEditTodo() {
  isEditing = false; // Reset edit mode
  editIndex = null;

  // Reset the inputs
  clearInputs();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // Change the button back to 'Add'
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = '';
  addButton.title = 'Add';
  addButton.appendChild(addIcon);
  updateTaskCounter();
}

function updateTodoList() {
  // Sort todoList based on the current sort method
  let filteredTodos = todoList;

  // Apply filtering based on the selected filter method
  if (filterMethod === 'pending') {
    filteredTodos = todoList.filter((todo) => !todo.completed);
  } else if (filterMethod === 'completed') {
    filteredTodos = todoList.filter((todo) => todo.completed);
  }

  filteredTodos.sort((a, b) => {
    if (currentSortMethod === 'date') {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    } else if (currentSortMethod === 'category') {
      return currentCategorySortOrder === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (currentSortMethod === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return currentSortOrder === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    updateTaskCounter();
  });

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  for (let i = 0; i < filteredTodos.length; i++) {
    const todo = filteredTodos[i];
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
        <div class="task-info">
          <span class="task-name">${todo.name}</span>
          <span class="category-tag">${todo.category}</span>
          <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
        </div>
      </div>
      <div class="small-container">${todo.date}</div>
      <div class="small-container">${todo.time}</div>
      <button class="js-delete-button" onclick="deleteTodo(${todo.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
      <button class="js-edit-button" onclick="editTodo(${i})">
        <i class="fa-solid fa-pen"></i>
      </button>`;
  }

  // Show or hide the task container based on the presence of tasks
  if (todoList.length === 0) {
    addElement.style.display = 'none'; // Hide if no tasks
  } else {
    addElement.style.display = 'grid'; // Show if tasks exist
    addElement.innerHTML = todoListhtml;
  }

  console.log(window.innerWidth);

  // Add event listeners for delete and edit buttons
  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      deleteTodo(index);
    });
  });

  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      editTodo(index);
    });
  });

  // Call the task counter update function
  updateTaskCounter();
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].slice(0, 5);

  inputDateElement.value = date;
  inputDateElement.min = date; // Set the min attribute to today's date
  inputTimeElement.value = time;
  inputTimeElement.min = time; // Set the min attribute to current time
}

function sortTodos(sortBy) {
  if (sortBy === 'priority') {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else if (sortBy === 'category') {
    currentCategorySortOrder =
      currentCategorySortOrder === 'asc' ? 'desc' : 'asc';
  }
  currentSortMethod = sortBy;
  updateTodoList();
}

function filterTodos() {
  const filterElement = document.querySelector('.js-filter-input');
  filterMethod = filterElement.value;
  updateTodoList();
}

// this shows the sucessNotification for 4000ms
function successNotification() {
  const success = document.getElementById('js-success-notification');
  success.style.display = 'flex';
  setTimeout(() => {
    success.style.display = 'none';
  }, 4000);
}

// 切换完成状态
async function toggleComplete(id) {
    try {
        const todo = todoList.find(t => t.id === id);
        if (todo) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTodo)
            });
            if (response.ok) {
                await loadTodos();
            }
        }
    } catch (error) {
        console.error('Error toggling todo completion:', error);
    }
}

function updateTaskCounter() {
  const totalTasks = todoList.length;

  // Select the element where the task counter is displayed
  const taskCounterButton = document.querySelector('.task-counter-button');

  // Update the text of the task counter button
  if (taskCounterButton) {
    taskCounterButton.innerText = `Tasks: ${totalTasks}`;
  }
}

// Initialize the todo list and set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  setDefaultDateTime();

  // Set focus on the name input field
  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // Add event listeners to buttons
  document.querySelector('.js-add-button').addEventListener('click', addTodo);
  document
    .querySelector('.js-cancel-button')
    .addEventListener('click', cancelEditTodo);

  // Add event listeners for sorting buttons
  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTodos('category'));
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTodos('priority'));

  // Add event listener for filter button
  document
    .querySelector('.js-filter-input')
    .addEventListener('change', filterTodos);
});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();
