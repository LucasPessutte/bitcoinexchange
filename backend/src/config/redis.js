import { createClient } from 'redis';

const redisClient = createClient({ url: 'redis://platform_redis:6379' });
const redisSubscriber = redisClient.duplicate(); // conexão separada para subscribe

redisClient.on('error', (err) => console.error('Redis (client) error:', err));
redisSubscriber.on('error', (err) => console.error('Redis (subscriber) error:', err));

await redisClient.connect();
await redisSubscriber.connect();

export { redisClient, redisSubscriber };