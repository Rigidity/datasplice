const fs = require('fs-extra');
const path = require('path');

module.exports = function datasplice(dir, spaces = '\t') {
	return {
		fetch: (...dirs) => {
			const loc = path.join(dir, ...dirs.slice(0, -1), dirs[dirs.length - 1] + '.json');
			fs.ensureDirSync(path.dirname(loc));
			if (!fs.existsSync(loc)) fs.writeJsonSync(loc, {}, {spaces});
			return {
				get: (...keys) => {
					let res = fs.readJsonSync(loc);
					while (keys.length) {
						const key = keys.shift();
						if (res[key] === undefined) {
							res[key] = {};
						}
						res = res[key];
					}
					return res;
				},
				set: (...keys) => {
					if (keys.length < 2) return false; 
					let data = fs.readJsonSync(loc);
					let res = data;
					while (keys.length > 2) {
						const key = keys.shift();
						if (res[key] === undefined) {
							res[key] = {};
						}
						res = res[key];
					}
					res[keys[0]] = keys[1];
					fs.writeJsonSync(loc, data, {spaces});
					return true;
				},
				has: (...keys) => {
					if (!keys.length) return true; 
					let data = fs.readJsonSync(loc);
					let res = data;
					while (keys.length > 1) {
						const key = keys.shift();
						if (res[key] === undefined) {
							res[key] = {};
						}
						res = res[key];
					}
					return keys[0] in res;
				},
				create: (...keys) => {
					if (keys.length < 2) return false; 
					let data = fs.readJsonSync(loc);
					let res = data;
					while (keys.length > 2) {
						const key = keys.shift();
						if (res[key] === undefined) {
							res[key] = {};
						}
						res = res[key];
					}
					if (res[keys[0]] === undefined) {
						res[keys[0]] = keys[1];
						fs.writeJsonSync(loc, data, {spaces});
						return true;
					}
					return false;
				},
				delete: (...keys) => {
					if (!keys.length) {
						fs.writeJsonSync(loc, {}, {spaces});
						return true;
					}
					let data = fs.readJsonSync(loc);
					let res = data;
					while (keys.length > 1) {
						const key = keys.shift();
						if (res[key] === undefined) {
							res[key] = {};
						}
						res = res[key];
					}
					return delete res[keys[0]];
				}
			};
		}
	};
};