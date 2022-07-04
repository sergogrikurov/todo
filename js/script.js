//находим элементы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#empty-list');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEpmtyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

function addTask(e) {
	//отменяем отправку формы
	e.preventDefault();
	//достаём текст задачи из ввода
	const taskText = taskInput.value;
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};
	//добавляем объект в массив с задачей
	tasks.push(newTask);
	//добавляем задачу в хранилище браузера LocalStorage
	saveToLocalStorage();

	renderTask(newTask);
	//очищаем поля ввода и возвращаем фокус
	taskInput.value = "";
	taskInput.focus();

	checkEpmtyList();
}

function deleteTask(e) {
	//проверяем если клик был не по кнопке "удалить задачу"
	if (e.target.dataset.action !== 'delete') return;
	//проверяем что клик был по кнопке "удалить задачу"
	const parentNode = e.target.closest('.list-group-item ');
	//определяем ID задачи
	const id = Number(parentNode.id);
	//удаляем задачу через фильтрацию массива
	tasks = tasks.filter((task) => task.id !== id);
	//добавляем задачу в хранилище браузера LocalStorage
	saveToLocalStorage();
	//удаляем задачу из разметки
	parentNode.remove();
	checkEpmtyList();
}

function doneTask(e) {
	//проверяем что клик был не по кнопке "задача выполнена"
	if (e.target.dataset.action !== 'done') return;
	//проверяем что клик был по кнопке "задача выполнена"
	const parenNode = e.target.closest('li');
	//определяем ID задачи
	const id = Number(parenNode.id);

	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;
	//добавляем задачу в хранилище браузера LocalStorage
	saveToLocalStorage();

	const taskTitle = parenNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEpmtyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="empty-list" class="list-group-item empty-list">
					<img class="leaf" src="./img/leaf.jpg" alt="Leaf">
					<div class="empty-list__title">Список дел пуст</div>
					</li>`;
		taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#empty-list');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	const cssClass = task.done ? "task-title task-title--done" : "task-title";
	const taskHTML = `<li id="${task.id}" class="list-group-item task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
	<button type="button" data-action="done" class="btn-action">
		<img class="done" src="./img/done.png" alt="Done">
	</button>
	<button type="button" data-action="delete" class="btn-action">
		<img class="cross" src="./img/cross.png" alt="Cross">
	</button>
</div>
</li>`;
	taskList.insertAdjacentHTML('beforeend', taskHTML);
}