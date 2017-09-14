import Bar from './bar';
import { Inject } from '../injector';

@Inject(Bar)
export default class Foo {
  constructor(bar) {
    this.bar = bar;
  }

  lala() {
    alert(this.bar.blah());
  }
}