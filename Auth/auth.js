const jwt = require('jsonwebtoken')
const { Client } = require('pg')

const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASS,
    database: process.env.PGDB
})
client.connect()

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.secret)
        const user = await client.query(`SELECT * FROM users WHERE email=$1 AND tokens = $2`,[decoded.pass,[token]])
        // console.log(user.rows[0].tokens)
        if(user.rowCount === 0) {
            throw Error()
        }
        req.user = user.rows[0]
        auth_token = token
        next()
    }
    catch(e) {
        console.log(e)
        res.status(401).send('Authentication Error')
    }
}

module.exports = auth