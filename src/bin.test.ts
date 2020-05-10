import { writeFile } from 'fs';

jest.mock('fs', () => ({
  writeFile: jest.fn((file, data, callback) => callback()),
}));

const texsvg = jest.fn((value) => Promise.resolve(value));
jest.mock('.', () => texsvg);

let consoleError: jest.SpyInstance;
let consoleLog: jest.SpyInstance;
let processExit: jest.SpyInstance;

beforeAll(() => {
  // mock implementation to override default behavior (prevent exit or log)
  consoleError = jest.spyOn(console, 'error').mockImplementation();
  consoleLog = jest.spyOn(console, 'log').mockImplementation();
  processExit = jest.spyOn(process, 'exit').mockImplementation();
});

const { argv } = process;

afterAll(() => {
  process.argv = argv;
  jest.restoreAllMocks();
});

describe('bin', () => {
  const processArgv = ['node', 'bin.js'];
  const tex = 'tex';
  const file = 'file.svg';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exits with error when no arguments are passed', () => {
    jest.isolateModules(() => {
      process.argv = processArgv;
      require('./bin');
      expect(processExit).toBeCalledWith(9);
      expect(consoleError).toBeCalledWith('Usage: texsvg <tex> <file>');
    });
  });

  it('logs SVG to console when 1 argument is passed', (done) => {
    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex];
      await require('./bin');
      expect(processExit).not.toBeCalled();
      expect(texsvg).toBeCalledWith(tex);
      expect(consoleLog).toBeCalledWith(tex);
      done();
    });
  });

  it('saves SVG to file when 2 arguments are passed', (done) => {
    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex, file];
      await require('./bin');
      expect(processExit).not.toBeCalled();
      expect(texsvg).toBeCalledWith(tex);
      expect(consoleLog).not.toBeCalled();
      expect(writeFile).toBeCalledWith(file, tex, expect.any(Function));
      done();
    });
  });

  it('logs error to console if there is an exception', (done) => {
    jest.isolateModules(async () => {
      const error = 'Error';
      texsvg.mockRejectedValueOnce(error);
      process.argv = [...processArgv, tex];
      await require('./bin');
      expect(processExit).not.toBeCalled();
      expect(texsvg).toBeCalledWith(tex);
      expect(consoleLog).not.toBeCalled();
      expect(writeFile).not.toBeCalled();
      expect(consoleError).toBeCalledWith(error);
      done();
    });
  });
});
