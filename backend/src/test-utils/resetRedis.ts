export async function resetRedis(client: any) {
  // node-redis v4 has .keys and .del; ioredis-mock does too
  const keys = await client.keys('*');
  if (keys.length) await client.del(keys);
}