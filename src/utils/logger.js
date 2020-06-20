import winston from 'winston';
const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'log/combined.log' }),
      new winston.transports.Console()
    ]
  });

  export default {
    info: console.log
  };
   