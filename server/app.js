const express = require('express');
const cors = require('cors');
const path = require('path');

/* --------------------------------- ROUTES --------------------------------- */

/* ------------------------------ Error Handler ----------------------------- */

const app = express();

/* ------------------------------- Middleware ------------------------------- */

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

/* --------------------------------- ROUTES --------------------------------- */

/* ------------------------------ Error Handler ----------------------------- */
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 400));
});

module.exports = app;
