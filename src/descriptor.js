/**
* Descriptor.js
* An extensible interface for describing and working with things, particularly datasets.
*/

// Utility Methods
import isArray from 'isarray';
import clone from 'clone';

var cached = {};

function evaluate (registered, directives, type, doc, options) {
	options || (options = {});

	var result;
	var directive;
	var directiveName;
	var directiveValue;
	var key;

	// get the directives that are actually registered
	var validDirectives = {};

	for (key in directives) {
		if (registered.hasOwnProperty(key)) {
			validDirectives[key] = directives[key];
		}
	}

	// TODO: need a better way to handle the proper order... sort of hardcoded at the moment and it's bad.
	if (type) {
		for (directiveName in validDirectives) {
			directive = registered[directiveName];

			if (directive.type === type) {
				directiveValue = directives[directiveName];

				doc = directive.handler(doc, directiveValue);
			}
		}
	}

	// run the comparators on each node
	var resultType = ('resultType' in options ? (options.resultType) : 'auto');
	var resultTypeIsArray = (resultType === 'auto' ? isArray(doc) : (resultType === 'array'));
	var value;
	var passes;

	result = (resultTypeIsArray ? [] : {});

	for (key in doc) {
		if (doc.hasOwnProperty(key)) {
			value = doc[key];
			passes = true;

			for (directiveName in validDirectives) {
				directive = registered[directiveName];
				directiveValue = directives[directiveName];

				if (directive.type === 'comparator') {
					passes &= directive.handler(value, directiveValue);
				}

				if (!passes) {
					break;
				}
			}

			if (passes) {
				resultTypeIsArray ? (result.push(value)) : (result[key] = value);
			}
		}
	}

	// filter arrays
	if (resultTypeIsArray) {
		for (directiveName in validDirectives) {
			directive = registered[directiveName];
			directiveValue = directives[directiveName];

			if (directive.type === 'array') {
				result = directive.handler(result, directiveValue);
			}
		}
	}

	return result;
}

class Descriptor {
	constructor (directives, type, options) {
		this.directives = directives;
		this.type = type;
	}

	evaluate (doc, options) {
		return evaluate(Descriptor.registered, this.directives, this.type, doc, options || this.options);
	}

	getDirectives () {
		return this.directives;
	}

	getType () {
		return this.type;
	}

	stringify () {
		return JSON.stringify(this.directives);
	}
}

Descriptor.registered = {};

/**
 * Creates a serializable string version of the descriptor
 */
Descriptor.stringify = d => (d instanceof Descriptor) ? d.stringify : JSON.stringify(d);

/**
 * Creates a descriptor from a string
 */
Descriptor.parse = s => {
	const directives = JSON.parse(s);
	return new Descriptor(directives);
};

/**
 * Compiles and returns a function that when given an array, will return a subset
 * of the array whose components meet the requirements of the request
 * @param {Object} directives
 */
Descriptor.compile = (directives, type) => {
	const descriptorKey = Descriptor.stringify(directives);
	let descriptor = cached[descriptorKey];

	if (!descriptor) {
		descriptor = (cached[descriptorKey] = new Descriptor(directives, type));
	}

	return descriptor.evaluate.bind(descriptor);
};

Descriptor.register = function (type, directive, handler) {
	this.registered[directive] = {
		'type': type,
		'directive': directive,
		'handler': handler
	};
};

/**
 * A factory method for creating new Descriptor types
 * @return {class}	The new Descriptor subclass
 */
Descriptor.extend = function () {
	let extended = Object.create(this);
	extended.registered = clone(this.registered);
	return extended;
};

// expose
module.exports = Descriptor;
