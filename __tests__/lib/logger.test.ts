import { debug } from '@/lib/logger';

const setNodeEnv = (value: string | undefined) => {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value,
    writable: true,
    configurable: true,
  });
};

describe('lib/logger', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalDebug = console.debug;

  beforeEach(() => {
    console.debug = jest.fn();
  });

  afterEach(() => {
    setNodeEnv(originalEnv);
    console.debug = originalDebug;
  });

  it('logs in non-production environment', () => {
    setNodeEnv('development');
    debug('test message', 123);

    expect(console.debug).toHaveBeenCalledWith('[debug]', 'test message', 123);
  });

  it('logs in test environment', () => {
    setNodeEnv('test');
    debug('test');

    expect(console.debug).toHaveBeenCalledWith('[debug]', 'test');
  });

  it('does not log in production environment', () => {
    setNodeEnv('production');
    debug('should not appear');

    expect(console.debug).not.toHaveBeenCalled();
  });

  it('handles multiple arguments', () => {
    setNodeEnv('development');
    debug('a', 'b', 'c', 1, 2, 3);

    expect(console.debug).toHaveBeenCalledWith('[debug]', 'a', 'b', 'c', 1, 2, 3);
  });
});
