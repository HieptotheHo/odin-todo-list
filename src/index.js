import './style.css'
import { createTodo } from './todo'
import {isToday, isThisWeek, compareAsc} from 'date-fns'
var toDos = []
localStorage.clear()
const Controller = () => {
    //UPDATE
    const update = (toDos) => {
        const toDoContainer = document.querySelector('#to-do-container');
        toDoContainer.querySelectorAll('.to-dos:not(:last-child)').forEach(e => {e.remove()})
        
        toDos.forEach(newTodo => {
            const todoDOM = document.createElement('div')
            todoDOM.classList.add('to-dos')
            todoDOM.innerHTML=`
                <h3>${newTodo.title}</h3>
                <div class="progress-bar">
                    <div class="done"></div>
                </div>
                <div class='percentage'></div>
            `
            
            //GET TASKS of the new to do
            document.querySelectorAll('.modal>form>#task-container>*').forEach(taskDOM=>{
                const taskName = taskDOM.querySelector('p').textContent
                const taskDone = taskDOM.querySelector('input').checked
                newTodo.addTask(taskName,taskDone)
            })
            
            localStorage.setItem('to-dos',JSON.stringify(toDos))
            addDeleteTaskButton(todoDOM, newTodo);
            addModalToDo(todoDOM, newTodo)
            
            const toDoContainer = document.querySelector('#to-do-container');
            toDoContainer.insertBefore(todoDOM, document.querySelector('.add.to-dos'))
        })
    }

    //REMOVE to do
    const addDeleteTaskButton = (todoDOM, newTodo) => {
        const deleteTaskButton = document.createElement('div')
        deleteTaskButton.classList.add('delete-task')
        deleteTaskButton.addEventListener('click',(e)=> {
            todoDOM.remove();
            toDos = toDos.filter(todo=>todo['title']==newTodo.title)
        })
        todoDOM.appendChild(deleteTaskButton)
    }
    //MODAL FOR TODO
    const addModalToDo = (todoDOM, newTodo) => {
        const todoDetail = document.createElement('dialog')
        todoDetail.classList.add('to-do-detail')
        todoDetail.innerHTML=`
            <div class='to-do-title'>
                <h1>${newTodo.title}</h1>
            </div>
            <div class='to-do-due'>
                <h3>${newTodo.due}</h3>
            </div>
            
            <div class='to-do-description'>
                <p style="text-wrap:wrap;overflow-wrap: break-word;">"${newTodo.description}"</p>
            </div>
            <div class="close-todo-detail">
                <p>x</p>
            </div>
        `
        
        const newToDoTask = document.createElement('div');
        newToDoTask.classList.add('to-do-tasks')
        newTodo.getTasks().forEach(task=>{
            const taskDOM = document.createElement('div')
            taskDOM.classList.add('task')
            taskDOM.innerHTML = `
                <p ${task.done?'style="text-decoration: line-through; color:gray;"':''}>${task.name}</p>
            `
            const checkBox = document.createElement('input')
            if(task.done) checkBox.checked = true;
            checkBox.setAttribute('type','checkbox')

            updateProgressBar(todoDOM,newTodo);
            hoverEffect(todoDOM, newTodo);
            checkBox.addEventListener('change',(e)=>{
                const name = taskDOM.querySelector('p').textContent
                if(checkBox.checked) {
                    taskDOM.querySelector('p').style = "text-decoration: line-through; color:gray;";
                    newTodo.getTasks().forEach(task => {
                        if(task.name == name) {
                            task.done = true
                        }
                    })
                }
                else{
                    taskDOM.querySelector('p').style ="text-decoration: none; color:black;";
                    newTodo.getTasks().forEach(task => {
                        if(task.name == name) {
                            task.done = false
                        }
                    })
                }
                updateProgressBar(todoDOM,newTodo);
                hoverEffect(todoDOM, newTodo);
            })

            taskDOM.append(checkBox)
            newToDoTask.appendChild(taskDOM)
        })
        todoDetail.appendChild(newToDoTask)
        todoDOM.appendChild(todoDetail)
        todoDOM.addEventListener('click',(e)=>{
            todoDetail.showModal()
        })
        const closeDetail =todoDetail.querySelector('.close-todo-detail')
        closeDetail.addEventListener('click',(e)=>{
            todoDOM.querySelector('dialog').close(  )
        })
    }

    const updateProgressBar = (todoDOM, newTodo) => {
        console.log(newTodo.getNumberOfTasks())
        todoDOM.querySelector('.progress-bar > .done').style.width=`${newTodo.getNumberOfTasks()!=0?Math.round(newTodo.getNumberOfDoneTasks()/newTodo.getNumberOfTasks()*100):0}%`
    }

    const hoverEffect = (todoDOM,newTodo) => {
        const percentage = todoDOM.querySelector('.percentage')
        

        percentage.innerHTML=`
            <h2>${newTodo.getNumberOfTasks()!=0?Math.round(newTodo.getNumberOfDoneTasks()/newTodo.getNumberOfTasks()*100):0}%</h2>
        `
        percentage.style.textAlign = 'right'
        const progressBar = todoDOM.querySelector('.progress-bar')

        percentage.style.visibility='hidden'
        todoDOM.addEventListener('mouseover',(e)=>{
            progressBar.style.visibility = 'hidden'
            percentage.style.visibility='visible'
        })
        todoDOM.addEventListener('mouseout',(e)=>{
            progressBar.style.visibility = 'visible'
            percentage.style.visibility='hidden'
        })
    }
    if(!localStorage.getItem('to-dos')) {
        console.log('too bad!')
    } else {
        console.log(localStorage)
        JSON.parse(localStorage.getItem('to-dos')).forEach(todo => {
            toDos.push(createTodo(todo.title,todo.description,todo.due,todo.tasks))
        })
        update(toDos)
    }
    const filterTodos = (category,toDos) => {
        switch(category) {
            case 'All':
                update(toDos)
                break;
            case 'Today':
                update(toDos.filter(todo=>{
                    console.log(new Date(todo.due))
                    return isToday(new Date(todo.due))
                }
                ))
                break;
            case 'This Week':
                update(toDos.filter(todo=>{
                    console.log(new Date(todo.due))
                    return isThisWeek(new Date(todo.due))
                }))
                break;
            case 'Overdue':
                update(toDos.filter(todo=>{
                    console.log(new Date(todo.due))
                    console.log()
                    return compareAsc(new Date(), todo.due)==-1?false:true
                }))
                break;
        }
    }
    //MENU
    // const chosenMennu = document.querySelector('.menu-chosen')

    const menus = document.querySelectorAll('#menu > ul >li');
    menus.forEach(menu => {
        menu.addEventListener('click', (e)=>{
            const chosenMennu = document.querySelector('.menu-chosen')
            chosenMennu.classList.remove('menu-chosen')
            menu.classList.add('menu-chosen')
            filterTodos(menu.textContent,toDos)
        })     
    })
    
    const addButton = document.querySelector('.add')
    const modal = document.querySelector('.modal')
    const cancelButton = document.querySelector('button[type=reset]')

    const form = document.querySelector('form')
    // Adding new task
    addButton.addEventListener('mouseover',e=>{
        document.querySelector('.add>div').style.backgroundColor = "var(--theme)"
    })
    addButton.addEventListener('mouseout', e=>{
        document.querySelector('.add>div').style.backgroundColor = "rgb(233, 233, 233)"
    })
    addButton.addEventListener('click', e=>{
        modal.showModal()
    })
    
    const addTaskButton = document.querySelector('.modal>form>.add-task>p')
    const addNewTask = document.querySelector('.modal>form>.add-task>input')
    const taskContainer = document.querySelector('.modal>form>#task-container')
    addTaskButton.addEventListener('click',(e)=>{
        if(addNewTask.value) {
            const newTask = document.createElement('div')
            newTask.classList.add('task')
            newTask.innerHTML=`
                <p>${addNewTask.value}</p>
                <input type='checkbox'>
            `
            // form.insertBefore(newTask,document.querySelector('.modal>form>#buttons'))
            taskContainer.appendChild(newTask)
            addNewTask.value=''
        }
        
    })
   
    cancelButton.addEventListener('click',(e)=>{
        modal.close()
        document.querySelector('#task-container').innerHTML=''
    })

    form.addEventListener('submit',(e)=>{
        const data = new FormData(e.target);
        //GET DATA from FORM
        let title = data.get('title');
        let description = data.get('description');
        let due = data.get('due')

        //CREATE new object and its DOM
        const newTodo = createTodo(title,description,due)
        toDos.push(newTodo)
        console.log(newTodo.getTasks())
        update(toDos)

        form.reset();
        document.querySelector('#task-container').innerHTML=''
    })


}
Controller();