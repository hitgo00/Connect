const {MongoClient}=require('mongodb');

const mongo_url='mongodb://localhost:27017';
// for connecting to cloud cluster mongodb atlas
// const mongo_url='mongodb+srv://hit:mongo123@cluster0-gd4cn.mongodb.net/test?retryWrites=true&w=majority';

const dbName="Connect";


// (async ()=>{
//     const client=await MongoClient.connect(mongo_url)

//     const connectDb=client.db(dbName)

//     console.log(connectDb)
// })()

module.exports.connectdb=(dbName)=>{
    return MongoClient.connect(mongo_url,{ useNewUrlParser: true }).then(client=> client.db(dbName))
 }


