const mongoose=require('mongoose');

module.exports.connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("database connection success");
    } catch (error) {
        console.log("connection failed");
    }
}