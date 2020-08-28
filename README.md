# Data Splice
> This library aids in managing many JSON files that are grouped together in an easy to use way. It's an extremely small module, but it serves as a cleaner way to do something which is a basic task.

## Example
```js
const datasplice = require('datasplice');
const data = datasplice('data');

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
```

## Documentation
`datasplice(folder, options?)` Generates a datasplice manager.  
`data(...folders, file)` Generates a datasplice instance.  
`splice.file` The file path of the instance.  
`splice.data` The current data of the instance.  
`splice.save()` Saves the data to the file.  
`splice.load()` Loads the data from the file.  
`splice.defaults(data)` Merges the default data and the current data.  

## Options
`compact = false` Whether or not to have tabs in the resulting files.  
`cache = true` Whether or not to cache the data.  
`prefix = ''` The filename prefix.  
`suffix = '.json'` The filename suffix.  