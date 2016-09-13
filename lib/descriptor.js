'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Descriptor.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * An extensible interface for describing and working with things, particularly datasets.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

// Utility Methods


var _isarray = require('isarray');

var _isarray2 = _interopRequireDefault(_isarray);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cached = {};

function _evaluate(registered, directives, type, doc, options) {
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
	var resultType = 'resultType' in options ? options.resultType : 'auto';
	var resultTypeIsArray = resultType === 'auto' ? (0, _isarray2.default)(doc) : resultType === 'array';
	var value;
	var passes;

	result = resultTypeIsArray ? [] : {};

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
				resultTypeIsArray ? result.push(value) : result[key] = value;
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

var Descriptor = function () {
	function Descriptor(directives, type, options) {
		_classCallCheck(this, Descriptor);

		this.directives = directives;
		this.type = type;
	}

	_createClass(Descriptor, [{
		key: 'evaluate',
		value: function evaluate(doc, options) {
			return _evaluate(Descriptor.registered, this.directives, this.type, doc, options || this.options);
		}
	}, {
		key: 'getDirectives',
		value: function getDirectives() {
			return this.directives;
		}
	}, {
		key: 'getType',
		value: function getType() {
			return this.type;
		}
	}, {
		key: 'stringify',
		value: function stringify() {
			return JSON.stringify(this.directives);
		}
	}]);

	return Descriptor;
}();

Descriptor.registered = {};

/**
 * Creates a serializable string version of the descriptor
 */
Descriptor.stringify = function (d) {
	return d instanceof Descriptor ? d.stringify : JSON.stringify(d);
};

/**
 * Creates a descriptor from a string
 */
Descriptor.parse = function (s) {
	var directives = JSON.parse(s);
	return new Descriptor(directives);
};

/**
 * Compiles and returns a function that when given an array, will return a subset
 * of the array whose components meet the requirements of the request
 * @param {Object} directives
 */
Descriptor.compile = function (directives, type) {
	var descriptorKey = Descriptor.stringify(directives);
	var descriptor = cached[descriptorKey];

	if (!descriptor) {
		descriptor = cached[descriptorKey] = new Descriptor(directives, type);
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
	var extended = Object.create(this);
	extended.registered = (0, _clone2.default)(this.registered);
	return extended;
};

// expose
module.exports = Descriptor;