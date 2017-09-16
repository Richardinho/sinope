import { Inject } from '../injector';

export class Moo {
  constructor() {
  }

  blah() {
    return 'moooooooooo blhlhlhl';
  }
}

@Inject(Moo)
export default class Bar {
  constructor(moo) {
    this.moo = moo;
  }

  blah() {
    return this.moo.blah();
  }
}
