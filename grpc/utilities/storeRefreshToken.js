import redis from "../lib/redis.js";

const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refreshToken:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default storeRefreshToken;
