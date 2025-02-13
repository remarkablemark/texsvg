import { writeFile } from 'fs';

jest.mock('fs', () => ({
  writeFile: jest.fn((file, data, callback) => callback()),
}));

const texsvg = jest.fn((value) => Promise.resolve(value));
jest.mock('.', () => texsvg);

let consoleErrorSpy: jest.SpyInstance;
let consoleLogSpy: jest.SpyInstance;
let processExitSpy: jest.SpyInstance;

beforeAll(() => {
  // mock implementation to override default behavior (prevent exit or log)
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exits with error when no arguments are passed', () => {
    jest.isolateModules(async () => {
      process.argv = processArgv;
      await require('./bin');
      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('<tex> [file] [options]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('TeX string is required');
    });
  });

  it('logs SVG to console when 1 argument is passed', (done) => {
    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex];
      await require('./bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).toHaveBeenCalledWith(tex);
      done();
    });
  });

  it('disables SVG optimization with option --optimize=false', (done) => {
    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex, '--optimize=false'];
      await require('./bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: false });
      expect(consoleLogSpy).toHaveBeenCalledWith(tex);
      done();
    });
  });

  it('saves SVG to file when 2 arguments are passed', (done) => {
    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex, file, file];
      await require('./bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalledWith(file, tex, expect.any(Function));
      done();
    });
  });

  it('logs error to console if there is an exception', (done) => {
    jest.isolateModules(async () => {
      const error = 'Error';
      texsvg.mockRejectedValueOnce(error);
      process.argv = [...processArgv, tex];
      await require('./bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(writeFile).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      done();
    });
  });
});
