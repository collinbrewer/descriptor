import {expect} from 'chai';
import Descriptor from '../src/descriptor.js';

describe('Descriptor', function () {
	context('#constructor', function () {
		it('should create a new descriptor', function () {
			var descriptor = new Descriptor();

			expect(descriptor).to.exist;
		});
	});

	context('#register', function () {
		it('should register a new directive', function () {
			Descriptor.register('array', 'directive', function () {});

			expect(Descriptor.registered).to.have.all.keys('directive');
		});
	});

	context('#extend', () => {
		it('should clone the descriptor', () => {
			let CustomDescriptor = Descriptor.extend();

			expect(CustomDescriptor).to.exist;
		});

		it('should clone the source descriptors registered directives', () => {
			let CustomDescriptor = Descriptor.extend();

			expect(CustomDescriptor.registered).to.have.all.keys('directive');
		});

		it('should exclude subsequent registered directives', () => {
			Descriptor.registered = {};
			Descriptor.register('array', 'sharedDirective', () => {});
			let CustomDescriptor = Descriptor.extend();
			Descriptor.register('array', 'originalDirective', () => {});
			CustomDescriptor.register('array', 'customDirective', () => {});

			expect(Descriptor.registered).to.have.all.keys('sharedDirective', 'originalDirective');
			expect(CustomDescriptor.registered).to.have.all.keys('sharedDirective', 'customDirective');
		});
	});

	context('#compile', function () {
		it('should create a new function', function () {
			var descriptor = {'foo': 'bar'};

			var f = Descriptor.compile(descriptor);

			expect(f).to.be.a('function');
		});
	});

	context('#stringify', function () {
		it('should return a string', function () {
			var descriptor = {'foo': 'bar'};

			var s = Descriptor.stringify(descriptor);

			expect(s).to.be.a('string');
		});
	});

	context('#parse', function () {
		it('should return a descriptor', function () {
			var s = '{"foo":"bar"}';
			var d = Descriptor.parse(s);

			expect(d instanceof Descriptor).to.be.true;
		});
	});

	context('#evaluate', function () {
		it('should return original document', function () {
			var doc = [3, 1, 2];
			var descriptor = {'no': 1, 'such': 2, 'descriptors': 3};
			var f = Descriptor.compile(descriptor);
			var results = f(doc);

			expect(results).to.have.length(3);
		});

		it('should evaulate a document against registered directive', function () {
			Descriptor.register('comparator', 'valueOfComplete', function (doc, value) {
				return doc.hasOwnProperty('complete') && doc.complete === value;
			});

			// array doc
			var doc = [
				{'complete': false},
				{'date': true},
				{'complete': true}
			];

			var descriptor = {'valueOfComplete': true};

			// Descriptor.registered.valueOfComplete(doc, true);

			var f = Descriptor.compile(descriptor);

			var results = f(doc);

			expect(results).to.have.length(1);

			// object doc
			doc = {
				'first': {'complete': false},
				'second': {'date': true},
				'third': {'complete': true}
			};
			results = f(doc);
			expect(results).to.have.property('third');
			expect(results).to.not.have.property('second');

			// object doc, with array results option
			doc = {
				'first': {'complete': false},
				'second': {'date': true},
				'third': {'complete': true}
			};
			results = f(doc, {resultType: 'array'});
			expect(results).to.be.an('array');
			expect(results).to.have.length(1);
		});
	});
});
