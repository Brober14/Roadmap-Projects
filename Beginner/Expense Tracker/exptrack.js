const { Command } = require("commander")
const fs = require("fs")
const path = require("path")

const tracker = new Command()
const date = new Date()
const dbPath = path.join(__dirname, "expense_tracker.json")


if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([{id:"ID", date:"Date", name:"Name", price:"Price"}]))
}

//Utility Functions
//Read/Write file func
function readFile() {
    const data = fs.readFileSync(dbPath)
    return JSON.parse(data)
}
function writeFile(entries) {
    fs.writeFileSync(dbPath, JSON.stringify(entries, null, 2), "utf8")
}

//Get next id func
function nextId(data) {
    ids = data.map(data => data.id)
    ids = ids.slice(1)
    ids.sort((a, b) => a - b)
    console.log(ids)
    let nextId = 1
    for (const id of ids) {
        if (nextId !== id) break
        nextId++
    }

    return nextId
}

//Get date func
function getDate() {

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}

//Get month name func
function getMonthName(monthNum) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return monthNames[monthNum - 1]
}

//Check if number and >0 func
function numberCheck(value) {
    if(!isNaN(value)) {
        if(parseInt(value) > 0) {
            return true
        }
    }
    return false
}

//Tracker Main Functions
function listExpenses(filter = null) {
    // const headers = ["ID", "Date", "Name", "Price"]
    // console.log(headers.map(h => h.padEnd(15)).join(""))
    let data = readFile()
    if(filter) {
        data = data.filter(data => data.month === parseInt(filter))
    }
    data.forEach((entry) => {
        console.log(`${entry.id.toString().padEnd(15)}${entry.date.padEnd(15)}${entry.name.padEnd(15)}${entry.price.toString().padEnd(15)}`)
    })
}

function addEntry(name, value) {
    const data = readFile()
    const ID = nextId(data)
    const entry = {
        id: ID,
        date: getDate(),
        name: name,
        price: value,
        month: date.getMonth() + 1
    }
    data.push(entry)
    writeFile(data)
    console.log(`Entry successfully added [${ID}]`)
}

function changeEntry(type, id, newValue) {
    data = readFile()
    entry = data.filter(data => data.id === parseInt(id))
    if(!entry) {
        console.log(`Entry with id [${id}] not found, try again!`)
        return
    }
    switch (type) {
        case "name":
            entry.name = newValue
            console.log(`Entry [${id}] name successfully changed to ${entry.name}`)
            break
        case "price":
            entry.price = newValue
            console.log(`Entry [${id}] price successfully changed to ${entry.price}`)
            break
    }
    writeFile(data)
}

function deleteEntry(id) {
    data = readFile()
    newData = data.filter(data => data.id !== parseInt(id))

    if (newData.length < data.length) {
        writeFile(newData)
        console.log(`Entry with id [${[id]}] successfully deleted from the list`)
    } else {
        console.log(`Entry with id [${id}] not found in the list, try again`)
    }
}

function summary(month = null) {
    data = readFile()
    let totalPrice = 0
    if(month) {
        data = data.filter((data) => data.month === parseInt(month))
        monthName = getMonthName(month)
    }
    for (obj of data) {
        if(obj.price === "Price") continue
        totalPrice += parseInt(obj.price)
    }

    console.log(`Total expense summary${month ? ` for ${monthName}`: ""}: $${totalPrice}`)
}

//Program information
tracker
    .name("Expense Tracker")
    .description("Expense Tracker CLI for roadmap.sh")
    .version("1.0.0")

//Program options
///
    
//Program commands
//List command
tracker
    .command("list")
    .alias("l")
    .description("List entries from the database. Optional: filter listed entries by month")
    .option("-f, --filter <value>", "number of month to be filtered by (same year)")
    .action((options) => {
        if (!options.filter) {
            listExpenses()
            return
        }
        if (!numberCheck(options.filter) || options.filter > 12 || options.filter < 1) {
            console.log("Wrong value for the filter provided, try again")
            return
        }

        listExpenses(options.filter)
    })

//Add command
tracker
    .command("add")
    .description("Adds a task with the specified name and price")
    .option("-n, --name <name>", "Name of the expense entry (Required)")
    // .option("-d, --description <string>", "Description for the expense entry")
    .option("-p, --price <value>", "Price of the expense entry (Required)")
    .action((options) => {
        if(!options.name || !options.price) {
            console.log("Error: missing required fields")
            return
        }
        if(!numberCheck(options.price)) {
            console.log("Wrong value for price, try again")
            return
        }
        addEntry(options.name, options.price)
    })

//Update command
tracker
    .command("update")
    .alias('u')
    .description("Change the name of entry or ots price")
    .option("--id <value>", "ID of the entry to change (Required)")
    .option("-t, --type <string>", "Type of entry change [name/price] (Required)")
    .option("-v --value <value>", "new value for the entry (Required)")
    .action((options) => {
        if(!options.id || !options.type || !options.value) {
            console.log("Error: missing required fields")
            return
        }
        if(!numberCheck(options.id)) {
            console.log("Wrong value for ID provided")
        }
        if(options.type === "price" && !numberCheck(options.value)) {
            console.log("Wrong value for price, try again")
            return
        }
        changeEntry(options.type, options.id, options.value)
        
    })

//Delete command
tracker
    .command("delete")
    .alias("del")
    .description("Delete the entry by specified id")
    .option("-id, --id <value>", "ID of the entry to delete (Required)")
    .action((options) => {
        if(!options.id || !numberCheck(options.id)) {
            console.log("No ID or wrong ID provided, try again")
            return
        }
        deleteEntry(options.id)
    })

//Summary command
tracker
    .command("summary")
    .alias("sum")
    .description("Total summary of expenses (Optional: For specified month)")
    .option("-m, --month [value]", "Month number to filter summary by it")
    .action((options) => {
        if(!options.month) {
            summary()
            return
        }
        if (!numberCheck(options.month) || options.month > 12 || options.month < 1) {
            console.log("Wrong value for the month provided, try again")
            return
        }
        summary(options.month)
    })

//Tracker args parsing
tracker.parse(process.argv)


