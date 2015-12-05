var ghpages = require('gh-pages');
var config = require('../webpack.config');

main();

function main() {
  var logger = console.error.bind(console);
  ghpages.publish(config.output.path, logger);
}
