// Works with node-redis v4, ioredis, ioredis-mock, or thin wrappers
export async function resetRedis(client: any) {
  // Native flush if available
  if (typeof client.flushAll === 'function') return client.flushAll();
  if (typeof client.FLUSHALL === 'function') return client.FLUSHALL();
  if (typeof client.flushdb === 'function') return client.flushdb();

  // v4 scanIterator (node-redis)
  if (typeof client.scanIterator === 'function') {
    const keys: string[] = [];
    for await (const key of client.scanIterator()) keys.push(key as string);
    if (keys.length) await client.del(keys);
    return;
  }

  // Fallback: SCAN paging
  if (typeof client.scan === 'function') {
    let cursor = '0';
    const keys: string[] = [];
    do {
      const res = await client.scan(cursor);
      cursor = Array.isArray(res) ? res[0] : res.cursor;
      const batch = Array.isArray(res) ? res[1] : res.keys;
      keys.push(...batch);
    } while (cursor !== '0');
    if (keys.length) await client.del(keys);
    return;
  }

  // Ultra-thin wrappers (custom store)
  if (Array.isArray(client._keys)) {
    for (const k of client._keys) await client.del(k);
    return;
  }

  throw new Error('Unsupported Redis client in tests: cannot reset');
}