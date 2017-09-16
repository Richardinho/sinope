import Injector, { INSTANCE } from '../injector';
import Foo from './foo';
import Bar, { Moo } from './bar';

let injector = new Injector();

injector.register({
  key: Foo,
  provider: Foo,
  mode: INSTANCE
});

injector.register({
  key: Bar,
  provider: Bar,
  mode: INSTANCE
});

injector.register({
  key: Moo,
  provider: Moo,
  mode: INSTANCE
});

const foo = injector.get(Foo);

foo.lala();
