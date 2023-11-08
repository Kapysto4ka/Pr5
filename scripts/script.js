const input = document.querySelector("#input-task input");
const taskList = document.getElementById("task-list");
let taskId = 1;


if(localStorage.length){
    for(let task=1; task<=localStorage.length; task++){
        extractData(localStorage.getItem(`${task}`))
    }
}

function extractData(taskData){
    taskData = JSON.parse(taskData);
    taskId = taskData.id+1
    const newTask = document.createElement("div");
    newTask.className = "task-container";
    newTask.innerHTML = `
        <form>
            <input type="checkbox" id="task${taskData.id}" name="task">
            <label for="task${taskData.id}">Task ${taskData.id}</label><br>
        </form>
        <div class="task-text no-border">
        </div>
        <div class="time-container no-border  ">
        </div>
        <input class="new-text">
        <div class="remove-item no-border">
            <i class="fa-sharp fa-solid fa-xmark"></i>
        </div>
    `;
    taskList.insertBefore(newTask, taskList.firstChild);

    let isCheckboxHidden = false;
    const timeDiv = document.querySelector(".time-container")
    const editItem = document.querySelector('.new-text')
    const taskText = document.querySelector('.task-text.no-border');
    const removeButton = document.querySelector('i');
    const checkbox = document.getElementById(`task${taskData.id}`);
    const currentTaskId = taskId;

    editItem.classList.toggle('hide')
    taskText.innerHTML = taskData.text
    timeDiv.innerHTML = taskData.time
    checkbox.addEventListener("click" , function (){
         const label = document.querySelector(`label[for="task${taskData.id}"]`);
         label.style.textDecoration = "line-through";
         checkbox.classList.toggle("hide");
         checkbox.disabled = true;
         taskText.style.color ='gray';
    })

    removeButton.addEventListener("click", function () {
        taskList.removeChild(newTask);
        localStorage.removeItem(taskId);
    });

    newTask.addEventListener("dblclick", function (){
        editItem.classList.toggle('hide')
        isCheckboxHidden = !isCheckboxHidden;
        checkbox.classList.toggle('hide', isCheckboxHidden);
        checkbox.disabled = isCheckboxHidden;
        taskText.classList.toggle('hide')
        editItem.classList.toggle('hide');
        taskText.classList.toggle('hide');
        taskText.innerText = editItem.value;
        editItem.value = '';
        timeDiv.classList.toggle('hide')
    });

    editItem.addEventListener("keypress", function (event) {
        if (event.key === "Enter"){
            isCheckboxHidden = !isCheckboxHidden;
            timeDiv.classList.toggle('hide');
            checkbox.classList.toggle('hide', isCheckboxHidden);
            editItem.classList.toggle('hide');
            taskText.classList.toggle('hide');
            taskText.innerText = editItem.value;
            editItem.value = '';
        }
    });
}
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const inputValue = input.value;
        if (inputValue.trim() !== '' && inputValue.trim().length < 70) {
            const newTask = document.createElement("div");
            newTask.className = "task-container";
            newTask.innerHTML = `
                <form>
                    <input type="checkbox" id="task${taskId}" name="task">
                    <label for="task${taskId}">Task ${taskId}</label><br>
                </form>
                <div class="task-text no-border">
                </div>
                <div class="time-container no-border  ">
                </div>
                <input class="new-text">
                <div class="remove-item no-border">
                    <i class="fa-sharp fa-solid fa-xmark"></i>
                </div>
            `;
            taskList.insertBefore(newTask, taskList.firstChild);

            let isCheckboxHidden = false;
            const timeDiv = document.querySelector(".time-container")
            const editItem = document.querySelector('.new-text')
            const taskText = document.querySelector('.task-text.no-border');
            const removeButton = document.querySelector('i');
            const checkbox = document.getElementById(`task${taskId}`);
            const currentTaskId = taskId;

            editItem.classList.toggle('hide')
            taskText.innerHTML = inputValue

            const taskData = {
                id: taskId,
                text: inputValue,
                time: `${initTime()}`,
                isChecked: false
            };
            localStorage.setItem(taskId, JSON.stringify(taskData));

            timeDiv.innerHTML = initTime()

            checkbox.addEventListener('change', function() {
                const label = document.querySelector(`label[for="task${currentTaskId}"]`);
                label.style.textDecoration = "line-through";
                checkbox.classList.toggle("hide");
                checkbox.disabled = true;
                taskText.style.color ='gray';
                taskData.isChecked = true;
                localStorage.setItem(taskId, JSON.stringify(taskData));
            });
            newTask.addEventListener("dblclick", function (){
                editItem.classList.toggle('hide')
                isCheckboxHidden = !isCheckboxHidden;
                checkbox.classList.toggle('hide', isCheckboxHidden);
                checkbox.disabled = isCheckboxHidden;
                taskText.classList.toggle('hide')
                editItem.value = taskText.innerText;
                editItem.focus()
                timeDiv.classList.toggle('hide')
            });

            editItem.addEventListener("keypress", function (event) {
                if (event.key === "Enter"){
                    isCheckboxHidden = !isCheckboxHidden;
                    timeDiv.classList.toggle('hide');
                    checkbox.classList.toggle('hide', isCheckboxHidden);
                    editItem.classList.toggle('hide');
                    taskText.classList.toggle('hide');
                    taskText.innerText = editItem.value;
                    checkbox.disabled = false;
                }
            });

            removeButton.addEventListener("click", function (){
                newTask.remove()
                localStorage.removeItem(taskId);
            })

            taskId += 1;
        }
        input.value = "";
    }
});

function initTime(){
    const time = new Date()
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hours = timeFormat(time.getHours());
    let minutes = timeFormat(time.getMinutes());
    let seconds = timeFormat(time.getSeconds());
    return`${hours}:${minutes}:${seconds} ${day}.${month}.${year}`
}
function timeFormat(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}