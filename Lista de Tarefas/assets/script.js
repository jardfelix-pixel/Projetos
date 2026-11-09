const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");

const tasks = [];

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "task-item";

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.dataset.action = "toggle";
    checkbox.dataset.index = index;
    checkbox.setAttribute("aria-label", `Marcar "${task.text}" como concluída`);

    const number = document.createElement("span");
    number.className = "task-number";
    number.textContent = `${index + 1}.`;
    number.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    if (task.completed) {
      text.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Excluir";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.index = index;
    deleteButton.setAttribute("aria-label", `Excluir "${task.text}"`);

    label.append(checkbox, number, text);
    item.append(label, deleteButton);
    taskList.append(item);
  });

  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"}`;
  emptyState.hidden = tasks.length > 0;
  taskList.hidden = tasks.length === 0;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.push({ text, completed: false });
  taskForm.reset();
  taskInput.focus();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest('[data-action="toggle"]');
  if (!checkbox) {
    return;
  }

  const task = tasks[Number(checkbox.dataset.index)];
  if (task) {
    task.completed = checkbox.checked;
    renderTasks();
  }
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');
  if (!deleteButton) {
    return;
  }

  tasks.splice(Number(deleteButton.dataset.index), 1);
  renderTasks();
});

renderTasks();