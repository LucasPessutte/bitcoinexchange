import { createClient } from 'redis';
import config from './config.js';

const redis = createClient({
  url: config.endpoints.redis,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect(); 
export default redis;
