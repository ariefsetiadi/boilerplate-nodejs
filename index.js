const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middlewares/errorHandler');

const { swaggerUi, swaggerDocument } = require('./config/swagger');

const userRoutes = require('./src/modules/user/user.route');
const authRoutes = require('./src/modules/auth/auth.route');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  '/api-docs', swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port: ${process.env.PORT}`)
);

app.use(errorHandler);
