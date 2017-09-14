import Injector from '../injector';
import Foo from './foo';
import Bar from './bar';

let injector = new Injector();

injector.register({
  key: Foo,
  provider: Foo,
  mode: Injector.INSTANCE
});

injector.register({
  key: Bar,
  provider: Bar,
  mode: Injector.INSTANCE
});

const foo = injector.get(Foo);

foo.lala();
