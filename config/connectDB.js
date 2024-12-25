const mongoose = require('mongoose')

const conncectDB = async () => {
 const conn = await mongoose.connect(process.env.MONGO_URI)
 console.log
 (`Mongodb connected succesfully ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = conncectDB;