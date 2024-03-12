const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
dotenv.config({ path: `./config.env` });

process.on(`uncaughtException`, (err) => {
  console.log(`Uncaught Exception! Shutting down.....`);
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require(`./app`);

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log(`Connected to DB`));

const port = process.env.PORT;

app.get(`/`, (req, res) => {
    res.send(`Hello`);
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on(`unhandledRejection`, (err) => {
  console.log(`Unhandled Rejection! Shutting down.....`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
