// using postgres database music_player

const { Client } = require('pg')

let client = {}

function connect () {
    client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'music_player',
        user: 'postgres',
        password: 'abc123...'
    })

    client.connect((error) => {
        if (error) {
            throw error
        }else{
            console.log("connected database")
        }
    })
}

function query (query, values, resultCallback) {
    client.query(query, values, (error, result) => {
        if (error) {
            throw error
        }
        resultCallback(result)
    })
}

function disconnect () {
    client.end()
}

// public interface of the module
// 3 functions in this case

module.exports = {
    connect: connect,
    disconnect: disconnect,
    query: query
}