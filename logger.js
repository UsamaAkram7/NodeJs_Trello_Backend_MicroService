const winston = require('winston');
const path = require('path');

// define the custom settings for each transport (file, console)
const colors = {
  info: 'green',
  error: 'red',
  warn: 'yellow',
  debug: 'blue',
  http: 'white',
};

const winstonformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.json(),
  winston.format.timestamp(),
  //winston.format.align(),
  winston.format.printf(info => {
    const { timestamp, level, message, ...args } = info;
    const levelCaps = level.toUpperCase();
    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
  }),
);
const options = {
  fileInfo: {
    level: 'info',
    filename: `${__dirname}/logCM.log`,
    handleExceptions: true,
    //  json: true,
    colorize: true,
    // format: winstonformat
  },
  fileError: {
    level: 'error',
    filename: `${__dirname}/logCM.log`,
    handleExceptions: true,
    json: true,
    colorize: true,
    format: winstonformat,
  },
  fileDebug: {
    level: 'debug',
    filename: `${__dirname}/logCM.log`,
    handleExceptions: true,
    json: true,
    colorize: true,
    format: winstonformat,
  },
  fileWarn: {
    level: 'warn',
    filename: `${__dirname}/logCM.log`,
    handleExceptions: true,
    json: true,
    colorize: true,
    format: winstonformat,
  },
  fileHttp: {
    level: 'http',
    filename: `${__dirname}/logCM.log`,
    handleExceptions: true,
    json: true,
    colorize: true,
    format: winstonformat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    prettyPrint: true,
    colorize: true,
    format: winstonformat,
  },
};

// instantiate a new Winston Logger with the settings defined above
winston.addColors(colors);
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.fileInfo),
    new winston.transports.File(options.fileError),
    new winston.transports.File(options.fileDebug),
    new winston.transports.File(options.fileWarn),
    new winston.transports.File(options.fileHttp),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

//logger.addColors(colors);
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
