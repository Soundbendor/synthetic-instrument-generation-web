const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Beaver!1',
    database: 'sig'
})

module.exports = db;