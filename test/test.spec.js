import assert from 'assert';

import Injector from '../src/injector';

describe('Injector', function() {
  let injector;
  beforeEach(function () {
    injector = new Injector();
  });
  describe('register()', function () {
    it('should....', function() {
      assert.equal(injector.register(), true);
    });
  });
});
