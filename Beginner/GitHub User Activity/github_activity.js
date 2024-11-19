const fs = require("fs")
const path = require("path")

args = process.argv.slice(2)

async function fetchGithubActivity(user) {
    const response = await fetch(`https://api.github.com/users/${user}/events`)

    if(!response.ok) {
        if(response.status === 404) {
            throw new Error(`User ${user} not found, please check the username`)
        } else {
            throw new Error(`Failed to fetch the data: ${response.status}`)
        }
    }
    return response.json()
}

function dataHandling(events) {
    if(events.length === 0) {
        console.log(`No recent activity found`)
        return
    }

    events.forEach((event) => {
        let action
        switch (event.type) {
            case "PushEvent":
                commitCount = event.payload.commits.length
                action = `Pushed ${commitCount} commits to ${event.repo.name}`
                break
            case "IssuesEvent":
                action = `${event.payload.action} an issue in ${event.repo.name}`
                break
            case "WatchEvent":
                action = `Starred ${event.repo.name}`
                break
            case "ForkEvent":
                action = `Forked ${event.repo.name}`
                break
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`
                break
            default:
                action = `${event.type.replace("Event", "")} in ${event.repo.name}`
        }
        console.log(`-> ${action}`)
    })
}

function main(args) {
    if(args.length == 0 || args.length > 1) {
        console.log(`Please provide only username in arguments of command`)
        return
    }

    console.log(`\nUser ${args[0]} recent events on GitHub.com =>`)
    fetchGithubActivity(args[0])
        .then((events) => {
            dataHandling(events)
            console.log("")
        })
        .catch((err) => {
            console.log(err.message)
            process.exit(1)
        })
}

main(args)