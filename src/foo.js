function Hello() {
   return function decorator(target) {}
}

@Hello()
export default class Foo {
	bar() {
		return 'this is bar';
	}
}