import cron from 'node-cron';

const runIngestion = () => {
  console.log('Running ingestion engine...');
  // TODO: Implement the ingestion logic here
};

export const startIngestionEngine = () => {
  // Schedule the ingestion engine to run every hour
  cron.schedule('0 * * * *', runIngestion);
};
