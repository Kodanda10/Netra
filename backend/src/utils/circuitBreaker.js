const CircuitBreaker = require('opossum');
const winston = require('winston');
const { amogh_circuit_open_total } = require('../cost/metrics'); // Import circuit breaker metric

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const defaultOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const createCircuitBreaker = (action, options = {}) => {
  const breaker = new CircuitBreaker(action, { ...defaultOptions, ...options });

  breaker.on('open', () => {
    logger.warn(`Circuit Breaker for ${action.name || 'unknown'} is OPEN.`);
    amogh_circuit_open_total.labels({ namespace: 'default', service: 'circuit_breaker' }).inc();
  });

  breaker.on('halfOpen', () => {
    logger.info(`Circuit Breaker for ${action.name || 'unknown'} is HALF_OPEN.`);
  });

  breaker.on('close', () => {
    logger.info(`Circuit Breaker for ${action.name || 'unknown'} is CLOSED.`);
  });

  breaker.on('fallback', (err) => {
    logger.error(`Circuit Breaker fallback for ${action.name || 'unknown'}:`, err.message);
  });

  breaker.on('reject', () => {
    logger.warn(`Circuit Breaker for ${action.name || 'unknown'} REJECTED a call.`);
  });

  return breaker;
};

module.exports = {
  createCircuitBreaker,
};