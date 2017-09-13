import assert from 'assert';

import Foo from '../src/foo';

describe('Foo.prototype.bar()', function() {
  it('should return "this is bar"', function() {
    const foo = new Foo();
    assert.equal(foo.bar(), 'this is bar');
  });
});
