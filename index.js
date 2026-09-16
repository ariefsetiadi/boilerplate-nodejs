require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middlewares/errorHandler');

const { swaggerUi, swaggerDocument } = require('./config/swagger');

const userRoutes = require('./src/modules/user/user.route');
const authRoutes = require('./src/modules/auth/auth.route');

const app = express();

// Security headers
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  '/api-docs', swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port: ${process.env.PORT}`)
);

