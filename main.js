

var IsIoJS = parseInt(process.version.substr(1)) > 0;
if(IsIoJS){
  module.exports = require('./src/main');
} else {
  module.exports = require('./dist/main');
}
