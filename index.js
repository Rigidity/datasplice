const fs = require('fs-extra');
const path = require('path');

class DataSplice {
	constructor(file, {compact = false, cache = true} = {}) {
		this.file = file;
		this.data = {};
		this.compact = compact;
		this.cache = cache;
	}
	defaults(data, concat) {
		let content = fs.readJsonSync(this.file);
		content = concat ? mergeConcat({...data}, content) : merge({...data}, content);
		fs.writeJsonSync(this.file, content, this.compact ? undefined : {spaces: '\t'});
		if (this.cache) this.data = content;
		return this;
	}
	load() {
		const content = fs.readJsonSync(this.file);
		if (this.cache) this.data = content;
		return content;
	}
	save(data = this.data) {
		fs.writeJsonSync(this.file, data, this.compact ? undefined : {spaces: '\t'});
	}
}

function isObject(item) {
	return item && typeof item == 'object' && !Array.isArray(item);
}
function merge(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();
	if (isObject(target) && isObject(source)) {
	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) Object.assign(target, { [key]: {} });
				merge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return merge(target, ...sources);
};
function mergeConcat(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();
	if (isObject(target) && isObject(source)) {
	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) Object.assign(target, { [key]: {} });
				mergeConcat(target[key], source[key]);
			} else if (Array.isArray(target) && Array.isArray(source)) {
				target.push(...source);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return mergeConcat(target, ...sources);
};

module.exports = function datasplice(dir, {compact = false, cache = true, prefix = '', suffix = '.json'} = {}) {
	return (...dirs) => {
		const loc = path.join(dir, ...dirs.slice(0, -1), prefix + dirs[dirs.length - 1] + suffix);
		fs.ensureDirSync(path.dirname(loc));
		if (!fs.existsSync(loc)) fs.writeJsonSync(loc, {}, compact ? undefined : {spaces: '\t'});
		return new DataSplice(loc, {compact, cache});
	};
};