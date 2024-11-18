const fs = require("fs");
const path = require("path");

taskFilePath = path.join(__dirname, "tasks.json")
args = process.argv.slice(2)
argumentsList = ["list", "list to-do", "list in-progress", "list-done", "add", "delete", "changeName", "updateStatus"]

if(!fs.existsSync(taskFilePath)) {
    fs.writeFileSync(taskFilePath, JSON.stringify([]))
}

function readTasks() {
    const data = fs.readFileSync(taskFilePath)
    return JSON.parse(data)
}

function writeTasks(tasks) {
    fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2), "utf8")
}

function nextId(tasks) {
    ids = tasks.map(task => task.id)
    ids.sort((a, b) => a - b)
    let nextId = 1
    for (const id of ids) {
        if(nextId !== id) break;
        nextId++
    }

    return nextId;
}

function listTasks(filter = null){
    data = readTasks()
    filteredTasks = []

    //If no filter specified print all of the tasks
    if (!filter) {
        console.log("Printing all of the tasks =>")
        data.forEach((task) => {
            console.log(`[${task.id}] ${task.name}\n   Status: ${task.status}\n   Created at: ${task.createdAt}\n   Last updated: ${task.updatedAt}`)
        })
        return
    }

    //Filter the tasks
    data.forEach((task) => {
        if(task.status === filter.toLowerCase()) {
            filteredTasks.push(task)
        }
    })

    //Error msg if no tasks found for the filter
    if(filteredTasks.length == 0) {
        console.log(`No tasks found for specified filter(${filter})! Available filters; [to-do], [in-progress], [done]`)
    }

    //Print all of the filtered tasks
    filteredTasks.forEach((task) => {
        console.log(`Printing ${filter} tasks =>`)
        console.log(`[${task.id}] ${task.name}\n   Status: ${task.status}\n   Created at: ${task.createdAt}\n   Last updated: ${task.updatedAt}`)
    })

}

function addTask(taskName = null) {
    //Error msg if no name for the task is specified
    if(!taskName) {
        console.log("Please specify the name for the task to add")
        return
    }

    const time = new Date()
    const tasks = readTasks()
    const taskId = nextId(tasks)
    const task = {
        id: taskId,
        name : taskName,
        status: "todo",
        createdAt: time,
        updatedAt: time,
    }
    tasks.push(task)
    writeTasks(tasks)
    console.log(`Task successfully added [${taskId}]`)
    

}

//Update the name of the task
function updateTask(id = null, newName) {
    if(!id) {
        console.log(`Invalid taskID provided!`)
        return
    }

    tasks = readTasks()
    task = tasks.find((task) => task.id === parseInt(id))
    
    if(task) {
        const time = new Date()
        task.name = newName
        task.updatedAt = time
        writeTasks(tasks)
        console.log(`Task [${task.id}] name changed to ${newName}`)
    } else {
        console.log(`Task with id [${id}] not found`)
    }
    
}

//Update the status of the task
function updateStatus(id, newStatus) {
    const statuses = ["to-do", "in-progress", "done"]
    if(!id) {
        console.log(`No id is specified for the function`)
        return
    }
    if (!statuses.includes(newStatus)) {
        console.log(`Wrong type of status specified for the task update. Allowed types: [to-do], [in-progress], [done]`)
        return
    }

    tasks = readTasks()
    task = tasks.find((task) => task.id === parseInt(id))
    
    if (task) {
        const time = new Date()
        task.status = newStatus
        task.updatedAt = time
        writeTasks(tasks)
        console.log(`Task [${id}] status successfully changed to ${newStatus}`)
    } else {
        console.log(`Task with id [${id}] not found in the list`)
    }
}

//Delete the task from the list
function deleteTask(id) {
    if(!id) {
        console.log(`No taskID provided`)
    }

    tasks = readTasks()
    newTasks = tasks.filter((task) => task.id === parseInt(id))

    if (newTasks.length < tasks.length) {
        writeTasks(newTasks)
        console.log(`Task [${id}] successfully removed from the list`)
    } else {
        console.log(`Task with id [${id}] not found in the list`)
    }
      
}

//Main function
function taskTracker() {
    const command = args[0]
    switch(command) {
        case "list":
            if (args.length > 2) {
                console.log("Wrong usage of command, too many arguments")
                return
            } else if (args.length === 2) {
                listTasks(args[1])
                return
            } else {
                listTasks()
                return
            }
        case "add":
            const taskName = args.slice(1).join(" ")
            if (!taskName) {
                console.log(`Please provide a name for the task`)
            }

            addTask(taskName)
            break;
        case "delete":
            deleteTask(args[1])
            break;
        case "changeName":
            const newName = args.slice(2).join(" ")
            if (!newName) {
                console.log(`Please provide a new name for the task`)
                return
            }

            updateTask(args[1], newName)
            break;
        case "updateStatus":
            updateStatus(args[1], args[2])
        case "--help" || "-h":
            console.log(`Available commands: ${argumentsList}`)
        default:
            console.log(command, args)
            console.log(`Wrong command provided. Available commands: ${argumentsList}`)
    }
}

taskTracker()