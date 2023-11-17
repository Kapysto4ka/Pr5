document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#input-task input");
    const sortButton = document.querySelector('i.fa-solid.fa-sort');
    const taskList = document.getElementById("task-list");
    let isSortDescending = true;


     function outputTasks() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(task => {
      addTask(task.task, task.isCheckboxHidden, task.time);
    });
    }

    outputTasks();
    function addTaskToLocalStorage(task, isCheckboxHidden, time) {
          let tasks;
          if (localStorage.getItem('tasks') === null) {
            tasks = [];
          } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
          }
          tasks.push({
            task: task,
            isCheckboxHidden: isCheckboxHidden,
            time: time
          });
          localStorage.setItem('tasks', JSON.stringify(tasks));
        }


    function removeTaskFromLocalStorage(taskItem) {
        let tasks;
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
         tasks.forEach((task, index) => {
        if (task.task === taskItem.task) {
            tasks.splice(index, 1);
        }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldTask, newTask) {
        let tasks;
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.forEach(task => {
          if (task.task === oldTask) {
            task.task = newTask;
          }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCheckboxInLocalStorage(updatedTask){
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.forEach(task => {
          if(task.task === updatedTask.task){
              task.isCheckboxHidden = updatedTask.isCheckboxHidden
          }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const inputValue = input.value;
            if (inputValue.trim() !== '' && inputValue.trim().length < 70) {
                let isCheckboxHidden = false;
                addTask(inputValue, isCheckboxHidden, initTime());
                addTaskToLocalStorage(inputValue, isCheckboxHidden, initTime());
            }
            input.value = "";
        }
    });

    function initTime() {
        const time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = timeFormat(time.getHours());
        let minutes = timeFormat(time.getMinutes());
        let seconds = timeFormat(time.getSeconds());
        return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
    }

    function timeFormat(number) {
        return number < 10 ? "0" + number : number;
    }

    sortButton.addEventListener('click', function () {
        const doneTasks = [];
        const notDoneTasks = [];
        taskList.childNodes.forEach(task => {
            if (task.nodeType === 1) {
                console.log(task.getAttribute('innerHTML'))
                const done = task.getAttribute('data-done') === 'true';
                if (done) {
                    doneTasks.push(task);
                } else {
                    notDoneTasks.push(task);
                }
            }
        });

        let sortedTasks;

        if (isSortDescending) {
            sortedTasks = notDoneTasks.concat(doneTasks);
        } else {
            sortedTasks = doneTasks.concat(notDoneTasks);
        }

        taskList.innerHTML = '';

        sortedTasks.forEach(task => {
            taskList.appendChild(task);
        });

        isSortDescending = !isSortDescending;
    });

    function addTask(text, isCheckboxHidden, time) {
        const newTask = document.createElement("div");
        newTask.className = "task-container";
        newTask.innerHTML = `
    <form>
        <input type="checkbox" name="task">
        <label for="task">Не виконано</label><br>
    </form>
    <div class="task-text no-border"></div>
    <div class="time-container no-border"></div>
    <div class="remove-item no-border">
        <i class="fa-sharp fa-solid fa-xmark"></i>
    </div>
`;
        taskList.insertBefore(newTask, taskList.firstChild);

        const editT = document.createElement("div");
        editT.className = "time-container no-border";
        editT.innerHTML = '<input id="inputTask${id}" class="new-text" placeholder="Edit task">'
        const checkbox = newTask.querySelector('input[type="checkbox"]');
        const label = newTask.querySelector('label[for="task"]');
        const taskText = newTask.querySelector('.task-text.no-border');
        const timeDiv = newTask.querySelector(".time-container");
        const removeButton = newTask.querySelector('i.fa-sharp.fa-solid.fa-xmark');
        let checkboxRemoved;
        checkboxRemoved = checkbox == null;

        if (isCheckboxHidden) {
            newTask.setAttribute('data-done', 'true');
            label.innerHTML = 'Виконано'
            checkbox.remove()
            checkboxRemoved = true
            taskText.style.color = 'gray';
            taskText.style.textDecoration = "line-through";
        }
        taskText.innerHTML = text;
        timeDiv.innerHTML = time;

        checkbox.addEventListener('change', function () {
            label.innerHTML = 'Виконано'
            taskText.style.textDecoration = "line-through";
            checkbox.remove()
            checkboxRemoved = true
            checkbox.innerHTML = null
            taskText.style.color = 'gray';
            isCheckboxHidden = true;
            newTask.setAttribute('data-done', 'true');
            let task = {
                task : taskText.innerText,
                isCheckboxHidden : isCheckboxHidden,
                time : time
            }
            updateCheckboxInLocalStorage(task)
        });

        taskText.addEventListener("dblclick", function () {
             if (checkboxRemoved === false) {
                checkbox.disabled = !isCheckboxHidden;
                isCheckboxHidden = !isCheckboxHidden;
                checkbox.classList.toggle('hide', isCheckboxHidden);
                if (isCheckboxHidden) {
                    oldText = taskText.innerHTML;
                    taskText.innerHTML = editT.innerHTML;
                } else {
                    taskText.innerHTML = oldText;
                }
                timeDiv.classList.toggle('hide');
                 const editItem = document.querySelector('.new-text');
                if (editItem !== null) {
                    editItem.value = oldText;
                    editItem.focus();
                    editItem.addEventListener("keypress", function (event) {
                        if (event.key === "Enter") {
                            isCheckboxHidden = !isCheckboxHidden;
                            timeDiv.classList.toggle('hide');
                            checkbox.classList.toggle('hide', isCheckboxHidden);
                            editItem.classList.toggle('hide');
                            taskText.innerText = editItem.value;
                            checkbox.disabled = false;
                            updateTaskInLocalStorage(oldText,taskText.innerText)
                            }
                        });
                }
             }
        });

        removeButton.addEventListener('click', function () {
            newTask.remove();
            let task = {
                task : taskText.innerText,
                isCheckboxHidden : isCheckboxHidden,
                time : time
            }
            removeTaskFromLocalStorage(task);
        });
    }
});
