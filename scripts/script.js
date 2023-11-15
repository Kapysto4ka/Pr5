document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#input-task input");
    const sortButton = document.querySelector('i.fa-solid.fa-sort');
    const taskList = document.getElementById("task-list");
    let isSortDescending = true;

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const inputValue = input.value;
            if (inputValue.trim() !== '' && inputValue.trim().length < 70) {
                let isCheckboxHidden = false;
                addTask(inputValue, isCheckboxHidden, initTime());
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

        const checkbox = newTask.querySelector('input[type="checkbox"]');
        const label = newTask.querySelector('label[for="task"]');
        const taskText = newTask.querySelector('.task-text.no-border');
        const timeDiv = newTask.querySelector(".time-container");
        const removeButton = newTask.querySelector('i.fa-sharp.fa-solid.fa-xmark');

        if (isCheckboxHidden) {
            checkbox.classList.toggle("hide");
            taskText.style.color = 'gray';
            taskText.style.textDecoration = "line-through";
        }
        taskText.innerHTML = text;
        timeDiv.innerHTML = time;

        checkbox.addEventListener('change', function () {
            label.innerHTML = 'Виконано'
            taskText.style.textDecoration = "line-through";
            checkbox.remove()
            taskText.style.color = 'gray';
            isCheckboxHidden = true;
            newTask.setAttribute('data-done', 'true');
        });

        newTask.addEventListener("dblclick", function () {
            checkbox.disabled = !isCheckboxHidden;
            isCheckboxHidden = !isCheckboxHidden;
            checkbox.classList.toggle('hide', isCheckboxHidden);
        });

        removeButton.addEventListener('click', function () {
            newTask.remove();
        });
    }
});