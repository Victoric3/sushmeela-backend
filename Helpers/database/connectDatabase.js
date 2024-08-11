const mongoose = require("mongoose")
// const { autoSyncElastic } = require("../../Controllers/searchSuggestion")

connectDatabase =async  () => {

    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.07qdtob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` ,{useNewUrlParser : true})
    // .then(autoSyncElastic())
    console.log("MongoDB Connection Successfully")
}

module.exports = connectDatabase
