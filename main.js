let IdCounter = parseInt(localStorage.getItem('IdCounter')) || 0;
const input = document.querySelector('input[type="text"]');
const list = document.getElementById('list');
const stats = document.getElementById('stats');
const form = document.querySelector('form');

// Agregar evento submit al formulario
form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    addTask();
});

// Enviar datos del formulario al servidor JSON
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userInput');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const url = 'http://localhost:3000/tasks'; // Asegúrate de que la URL sea la correcta
        const task = document.getElementById('tarea').value;
        const person = document.getElementById('person').value;
        const fechaInicio = document.getElementById('inicio').value;
        const fechaFin = document.getElementById('fin').value;
        const prioridad = document.getElementById('urgencyInput').value;

        const data = {
            Tarea: task,
            nombre: person,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            prioridad: prioridad
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar los datos al servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos enviados al servidor:', data);
            // Aquí puedes hacer cualquier acción adicional que desees después de enviar los datos
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// Verificar plazos de las tareas
setInterval(checkTaskDeadlines, 1000); 

// Agregar una tarea a la lista
function addTask() {
    IdCounter++;

    let taskValue = input.value; 
    let personValue = document.getElementById('person').value; 
    let inicioValue = document.getElementById('inicio').value; 
    let finValue = document.getElementById('fin').value;
    let urgencyValue = document.getElementById('urgencyInput').value; 

    list.innerHTML += `
    <div class="task-container" id="${IdCounter}">
        <label>
            <input type="checkbox">
        </label>
        <p data-type="tarea">Tarea: ${taskValue}</p> 
        <p data-type="person">Persona: ${personValue}</p> 
        <p data-type="startDate">Fecha de inicio: ${inicioValue}</p> 
        <p data-type="endDate">Fecha de finalización: ${finValue}</p> 
        <p data-type="urgency">Urgencia: ${urgencyValue}</p> 
        <img src="./delete.png" class="closeBtn">
    </div>`;

    localStorage.setItem('IdCounter', IdCounter.toString());
    input.value = '';
    document.getElementById('person').value = '';
    document.getElementById('inicio').value = '';
    document.getElementById('fin').value= '';
    document.getElementById('urgencyInput').value= ''; 
    updateStats();
}

// Manejar eventos de clic en la lista de tareas
list.addEventListener('click', (event) => {
    if (event.target.nodeName === 'INPUT') {
        updateStats();
        toggleTaskState(event.target.parentNode.parentNode, event.target.checked);
    } else if (event.target.nodeName === 'IMG') {
        deleteTask(event.target.parentNode.id);
    }
});

// Cambiar estado de la tarea
function toggleTaskState(taskElement, checked) {
    if (checked) {
        taskElement.classList.add('completed');
    } else {
        taskElement.classList.remove('completed');
    }
}

// Actualizar estadísticas de tareas
function updateStats() {
    let tasks = list.querySelectorAll('.task-container');
    let checkboxes = list.querySelectorAll('input[type="checkbox"]:checked');
    let pendingTasks = tasks.length - checkboxes.length; 
    stats.innerHTML = `<p>Tareas Pendientes: ${pendingTasks} Completadas: ${checkboxes.length}</p>`;
}

// Eliminar una tarea
function deleteTask(id) {
    let taskToDelete = document.getElementById(id);
    list.removeChild(taskToDelete);
    updateStats();
}

// Verificar plazos de las tareas
function checkTaskDeadlines() {
    const tasks = list.querySelectorAll('.task-container');
    const currentDate = new Date();

    tasks.forEach(task => {
        const taskId = task.id;
        const endDateString = task.querySelector('p[data-type="endDate"]').textContent;
        const endDate = new Date(endDateString);

        if (currentDate > endDate) {
            task.classList.add('failed');
        } else {
            task.classList.remove('failed');
        }
    });
}
