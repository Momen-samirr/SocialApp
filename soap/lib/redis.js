import Redis from "ioredis";

const redis = new Redis(
  "rediss://default:AWr-AAIjcDE3ZGJjNzJmOGQ1YWM0ZTc0YmQ5NDVlNGNiYWRmYmFiNnAxMA@funny-flea-27390.upstash.io:6379"
);

export default redis;
