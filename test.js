const splice = require('./index');
const data = splice('data');

const config = data('config').load();
const server = data('servers', 'example', 'server').defaults({
	prefix: '!', polls: {}
});
server.load().prefix = '$';
server.save();
console.log(config.token);
const user = data('servers', 'example', 'users', 'person').defaults({
	balance: 0.00, experience: 51
});
user.load().balance = 15.00;
user.save();