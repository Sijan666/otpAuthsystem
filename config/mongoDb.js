const mongoose = require('mongoose');

const mongoDb = ()=>{
    return mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.nzekssh.mongodb.net/${process.env.MONGODB_DBNAME}?appName=Cluster0`)
    .then(() => console.log('Database Connected successfully'))
    .catch(err =>{
        console.log(err);
    })
}

module.exports = mongoDb