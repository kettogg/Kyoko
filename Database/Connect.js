const mongoose = require("mongoose");
const chalk = require("chalk");

if (!process.env.MONGO_URI) {
    throw new Error(chalk.red(`[DATABASE 1] `) + chalk.yellow(`The MONGO_URI environment variable is not set.`));
};

//=====================================| Connecting to DB |=====================================//

mongoose.connect(process.env.MONGO_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log(chalk.green(`[DATABASE 1] `) + chalk.cyan(`Connected to MongoDB!`));
});

mongoose.connection.on('disconnected', () => {
    console.log(chalk.red(`[DATABASE 1] `) + chalk.yellow(`Disconnected from MongoDB!`));
});

mongoose.connection.on('error', (err) => {
    console.log(chalk.red(`[DATABASE 1] `) + chalk.red(`Error: ${err}`));
});
