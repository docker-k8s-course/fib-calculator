const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // reconnect every 1000 ms if connection lost
});

const sub = redisClient.duplicate();

const fib = (index) => {
  if (index < 2) {
    return 1;
  }
  return fib(index - 1) + fix(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');