const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const config = require('./config/config');
const routerApi = require('./routes');
const {
  errorHandler,
  mongoErrorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');
const main = require('./libs/mongodb');

require('./utils/auth');
require('./utils/notifications/firebase');

//Config socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.socketCLientUrl,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.io = io;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: '1000mb' }));

app.get('/', (req, res) => {
  res.json('Hi Filibustero');
});

routerApi(app);

const mongoDbInit = async () => {
  await main();
};

app.use(boomErrorHandler);
app.use(mongoErrorHandler);
app.use(errorHandler);

mongoDbInit();

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(config.PORT, () => {
  console.log('Server PiratasApp Ready on port', config.PORT);
});
