const mongoose = require("mongoose");

// connect to the DB cluster using mongoose
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://nehakhemchandani5294_db_user:OzwxU0ZSEOBzy0F4@cluster0.mlckxvr.mongodb.net/devTinder"
    );
};

module.exports = {connectDB};

