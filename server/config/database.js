const mongoose = require("mongoose");

async function connectDB() {

    try {

        await mongoose.connect(process.env.MONGODB_URI, {

            serverSelectionTimeoutMS: 10000,

            autoIndex: true

        });

        console.log(" MongoDB Atlas Connected");

        mongoose.connection.on("connected", () => {

            console.log(" Database Ready");

        });

        mongoose.connection.on("disconnected", () => {

            console.log(" MongoDB Disconnected");

        });

        mongoose.connection.on("reconnected", () => {

            console.log(" MongoDB Reconnected");

        });

        mongoose.connection.on("error", (err) => {

            console.error("MongoDB Error:", err.message);

        });

    }

    catch (err) {

        console.error(" Failed to connect MongoDB");

        console.error(err.message);

        process.exit(1);

    }

}

module.exports = connectDB;