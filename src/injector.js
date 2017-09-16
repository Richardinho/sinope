export const INSTANCE = 'instance';
export const CACHE_INSTANCE = 'cache_instance';
export const FACTORY_FUNCTION = 'factory_function';
export const VALUE = 'value';

/**
* DI container.
*/
export default class Injector {

  constructor() {
    this.container = {};
  }

  register({ key, provider, mode = INSTANCE, locals = [] }) {

    this.container[key] = {
      provider,
      mode,
      locals,
    };
  }

  has(key) {
    return !!this.container[key];
  }

  get(key, keychain) {
    let instance;

    let config = this.container[key];

    if (!config) {
      throw Error('non existent injectable: ' + key);
    }

    const { mode } = config;

    keychain = (keychain || []).slice();

    if (keychain.indexOf(key) != -1) {
      throw Error('cyclical dependency detected for key: ' + key + ' in keychain ' + keychain);
    } else {
      keychain.unshift(key);
    }

    if (mode === CACHE_INSTANCE) {
      if (config.cachedInstance) {
        return config.cachedInstance;
      } else {
        instance = this.createInstance(config, keychain);
        config.cachedInstance = instance;
      }
    } else {
      instance = this.createInstance(config, keychain);
    }

    return instance;
  }

  createInstance(config, keychain) {

    const { provider, mode, locals } = config;
    const InjectableOptions = [];
    let dependencies;
    let result;

    dependencies = provider.__injectables__ || [];

    dependencies.forEach(dependencyKey => {
      InjectableOptions.push(this.get(dependencyKey, keychain));
    });

    switch(mode) {
    case INSTANCE:
    case CACHE_INSTANCE:
      result = new provider(...InjectableOptions, locals);
      break;
    case FACTORY_FUNCTION:
      result = provider(...InjectableOptions, locals);
      break;
    case VALUE:
      result = provider;
      break;
    }

    return result;

  }

  start(key, callback) {
    const injectable = this.get(key);
    callback(injectable);
  }
}

export const Inject = function (...args) {
  return function (Klass) {
    Klass.__injectables__ = args;
  };
};
