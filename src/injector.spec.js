import Injector, { INSTANCE, FACTORY_FUNCTION, CACHE_INSTANCE, VALUE } from '../src/injector';
import chai, { assert, expect } from 'chai';
import chaiSpies  from 'chai-spies';
chai.use(chaiSpies);

describe('injector', function() {
  let injector;
  beforeEach(function () {
    injector = new Injector();
  });
  describe('register()', function () {
    let key;
    let provider;

    beforeEach(function () {
      key = 'a';
      provider = function A() {};

      injector.register({
        key,
        provider,
        mode: INSTANCE
      });
    });
    it ('should should store injectables in container', function() {
      assert.deepEqual(injector.container[key], {
        provider,
        mode : INSTANCE,
        locals : [],
      });
    });
  });
  describe('get()', function () {
    let A, B, C;
    beforeEach(function () {
      A = function () {};
      B = function () {};
      C = function () {};
    });
    describe('when Injectable is in container', function () {
      beforeEach(function() {
        injector.register({
          key: 'a',
          provider: A
        });
      });
      it ('should NOT throw an error', function()  {
        assert.doesNotThrow(() => injector.get('a', []));
      });
    });
    describe('when Injectable is NOT in container', function () {
      it ('should throw an error', function() {
        assert.throws(() => injector.get('a', []), Error, 'non existent injectable: a');
      });
    });
    describe('when there is a cyclical dependency', function() {
      beforeEach(function () {
        A.__injectables__ = ['b'];
        B.__injectables__ = ['c'];
        C.__injectables__ = ['a'];

        injector.register({
          key: 'a',
          provider: A
        });

        injector.register({
          key: 'b',
          provider: B
        });

        injector.register({
          key: 'c',
          provider: C
        });
      });
      it ('should throw an error', function() {
        assert.throws(() => injector.get('a', []), Error,
          'cyclical dependency detected for key: a in keychain c,b,a'
        );
      });
    });
    describe('when there is NO cyclical dependency', function() {
      beforeEach(function () {
        A.__injectables__ = ['b'];
        B.__injectables__ = ['c'];
        C.__injectables__ = [];

        injector.register({
          key: 'a',
          provider: A
        });

        injector.register({
          key: 'b',
          provider: B
        });

        injector.register({
          key: 'c',
          provider: C
        });
      });
      it ('should NOT throw an error', function() {
        assert.doesNotThrow(() => injector.get('a', []));
      });
    });
    describe('when mode is CACHE_INSTANCE', function () {
      beforeEach(function () {
        injector.register({
          key: 'a',
          provider: A,
          mode: CACHE_INSTANCE
        });
      });
      it('should return same instance on every call', function () {
        assert.equal(injector.get('a'), injector.get('a')) ;
      });
    });
    describe('when mode is NOT CACHE_INSTANCE', function () {
      beforeEach(function () {
        injector.register({
          key: 'a',
          provider: A,
          mode: INSTANCE
        });
      });
      it('should NOT return same instance on every call', function () {
        assert.notEqual(injector.get('a'), injector.get('a')) ;
      });
    });
  });
  describe('createInstance()', function () {
    let config;
    let instance;
    let keychain = [];
    let A, B, C;
    describe('when mode is INSTANCE', function () {
      beforeEach(function () {

        A = () => {};

        config = {
          provider : A,
          mode : INSTANCE
        };

        instance = injector.createInstance(config, keychain);
      });
      it('should return an instance of the Provider', function () {
        assert.instanceOf(instance, A);
      });
    });
    describe('when mode is CACHE_INSTANCE', function () {
      beforeEach(function () {

        A = () => {};

        config = {
          provider : A,
          mode : CACHE_INSTANCE
        };

        instance = injector.createInstance(config, keychain);
      });
      it('should return an instance of the Provider', function () {
        assert.instanceOf(instance, A);
      });
    });
    describe('when mode is FACTORY_FUNCTION', function () {

      beforeEach(function () {

        A = () => { return 'b'; };

        config = {
          provider : A,
          mode : FACTORY_FUNCTION
        };

        instance = injector.createInstance(config, keychain);
      });

      it('should return value returned by provider function', function () {
        assert.equal(instance, 'b');
      });
    });
    describe('when mode is VALUE', function () {

      beforeEach(function () {

        A= 'a';

        config = {
          provider : A,
          mode : VALUE
        };

        //  when
        instance = injector.createInstance(config, keychain);
      });

      it('should return Provider itself', function () {
        assert.equal(instance, A);
      });
    });
    describe('when Injectable has dependencies', function () {
      beforeEach(function () {

        A = () => {};
        B = () => {};

        injector.register({
          key: 'a',
          provider: A
        });
        injector.register({
          key: 'b',
          provider: B
        });
      });

      describe('when mode is INSTANCE', function () {
        beforeEach(function () {

          C = function (a, b) {
            this.a = a;
            this.b = b;
          };

          C.__injectables__ = ['a', 'b'];

          config = {
            provider : C,
            mode : INSTANCE
          };

          instance = injector.createInstance(config, keychain);

        });

        it('should return an instance of the Provider', function () {
          assert.instanceOf(instance, C);
        });

        it('should inject first dependency into instance', function () {
          assert.instanceOf(instance.a, A);
        });

        it('should inject second dependency into instance', function () {
          assert.instanceOf(instance.b, B);
        });
      });

      describe('when mode is FACTORY_FUNCTION', function () {

        beforeEach(function () {

          C = (a) => { return a; };

          C.__injectables__ = ['a'];

          config = {
            provider: C,
            mode : FACTORY_FUNCTION
          };

          instance = injector.createInstance(config, keychain);
        });

        it('should pass dependency to factory function', function () {
          assert.instanceOf(instance, A);
        });
      });
    });
  });
  describe('start()', function () {
    let spy;
    beforeEach(function () {
      let A = () => {};

      injector.register({
        key: 'a',
        provider: A,
        mode: CACHE_INSTANCE
      });
      spy = chai.spy();
      injector.start('a', spy);
    });
    it('should call callback with instance', function () {
      const instance = injector.get('a');
      expect(spy).to.have.been.called.with(instance);
    });
  });
});
