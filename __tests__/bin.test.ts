import { writeFile } from 'fs';

jest.mock('fs', () => ({
  writeFile: jest.fn((file: string, data: string, callback: () => void) => {
    callback();
  }),
}));

const texsvg = jest.fn((value) => Promise.resolve(value));
jest.mock('../src/index', () => texsvg);

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

  it('exits with error when no arguments are passed', async () => {
    await jest.isolateModulesAsync(async () => {
      process.argv = processArgv;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      await require('../src/bin');
      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('<tex> [file] [options]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('TeX string is required');
    });
  });

  it('logs SVG to console when 1 argument is passed', async () => {
    await jest.isolateModulesAsync(async () => {
      process.argv = [...processArgv, tex];
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      await require('../src/bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).toHaveBeenCalledWith(tex);
    });
  });

  it('disables SVG optimization with option --optimize=false', async () => {
    await jest.isolateModulesAsync(async () => {
      process.argv = [...processArgv, tex, '--optimize=false'];
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      await require('../src/bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: false });
      expect(consoleLogSpy).toHaveBeenCalledWith(tex);
    });
  });

  it('saves SVG to file when 2 arguments are passed', async () => {
    await jest.isolateModulesAsync(async () => {
      process.argv = [...processArgv, tex, file, file];
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      await require('../src/bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalledWith(file, tex, expect.any(Function));
    });
  });

  it('logs error to console if there is an exception', async () => {
    await jest.isolateModulesAsync(async () => {
      const error = 'Error';
      texsvg.mockRejectedValueOnce(error);
      process.argv = [...processArgv, tex];
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      await require('../src/bin');
      expect(processExitSpy).not.toHaveBeenCalled();
      expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(writeFile).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
