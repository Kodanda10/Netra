import app from './app.js';
export function start(port = process.env.PORT || 3001) {
  return app.listen(port, () => console.log(`up on ${port}`));
}
if (process.env.NODE_ENV !== 'test') start();