const path = require(`path`);
const express = require('express');
const globalErrorHandler = require(`./controllers/errorController`);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require(`express-mongo-sanitize`);
const xss = require(`xss-clean`);
const cors = require(`cors`);

const parkingRouter = require(`./routes/parkingRouter`);
const userRouter = require(`./routes/userRouter`);
const reviewRouter = require(`./routes/reviewRouter`);

const app = express();

//Global Middlewares-

//Implement CORS
app.use(cors());

app.options(`*`, cors());
//Serving static files
app.use(express.static(path.join(__dirname, `public`)));
//Set Security HTTP Headers
app.use(helmet());
//Limit requests from same IP
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests! Try again in an hour`,
});
app.use(`/api`, rateLimiter);
//Body parser,reading data from body into req.body
app.use(express.json());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
app.get(`/`, (req, res) => {
  res.sendFile(`/index.html`);
});
app.use(`/api/v1/parkings`, parkingRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/reviews`, reviewRouter);
app.all(`*`, (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
