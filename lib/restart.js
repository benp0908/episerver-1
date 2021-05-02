const util = require('./util');
function restart() {
const now = util.time();
   const duration = 1000 * 60 * 3;
const mutedUntil = now + duration;
  if (now > mutedUntil) {process.exit(1)};
console.log('restart-time is successfully setted to: '+ mutedUntil);
}