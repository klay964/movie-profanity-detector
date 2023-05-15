const express = require('express');
const cors = require('cors');
const path = require('path');

/* --------------------------------- ROUTES --------------------------------- */
const videoRouter = require('./routes/videoRoute');

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

app.use('/api/v1/video', videoRouter);

/* ------------------------------ Error Handler ----------------------------- */
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 400));
});

module.exports = app;
