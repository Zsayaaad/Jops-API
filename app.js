// Hamada

require('dotenv').config();
require('express-async-errors');
const express = require('express');

// Security Packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const limiter = require('express-rate-limit');

const app = express();

const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const authMiddleware = require('./middleware/authentication');

app.use(
  limiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
