
const createTodo = (title,description,due,tasks=[])=>{
    
    const addTask = (taskName, done) => {
        tasks.push(createTask(taskName,done))
    }
    const getNumberOfTasks=() => tasks.length;

    const getNumberOfDoneTasks = () => tasks.filter(task=> task.done).reduce((doneTasks, task)=> doneTasks += 1,0)
    
    const finishTask = (name) => {
        tasks.forEach(task => {
            if(task.name==name) task.done = true
        })
    }
    const getTasks = () => tasks
    
    
    return {
        title: title,description:description, due: due,tasks:tasks,
        addTask, getTasks,
        getNumberOfTasks,
        getNumberOfDoneTasks,
        finishTask
    }
}

const createTask =(name,done) => {
    return {name:name, done:done}
}
export {createTodo}

// const createTask = (name,due)=> ({name: name, due: due, done: false})

// let todo = createTodo('Eat','...');

// todo.addTask('cook1','...');
// todo.addTask('cook2','...');
// todo.addTask('cook3','...');
// todo.addTask('cook4','...');

// console.log(todo.getTasks()[0]);
// console.log(todo.getNumberOfTasks())
// todo.finishTask("cook1")
// console.log(todo.getTasks())
// console.log(todo.getNumberOfDoneTasks())
