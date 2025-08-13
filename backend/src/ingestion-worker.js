const { ingestCycle } = require('./ingestion/fetcher');

const run = async () => {
  console.log('Starting ingestion worker...');
  await ingestCycle();
  console.log('Ingestion worker finished.');
};

run();
