import { writeFile } from 'node:fs/promises';
import type { Mock } from 'vitest';

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(() => Promise.resolve()),
}));

const mockIndex = {
  texsvg: vi.fn((value: unknown) => Promise.resolve(value)),
};
vi.mock('../src/index', () => mockIndex);

const { texsvg } = mockIndex;

let consoleErrorSpy: Mock;
let consoleLogSpy: Mock;
let processExitSpy: Mock;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

beforeAll(() => {
  // mock implementation to override default behavior (prevent exit or log)
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(noop);
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(noop);
  processExitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);
});

const { argv } = process;

afterAll(() => {
  process.argv = argv;
  vi.restoreAllMocks();
});

describe('bin', () => {
  const processArgv = ['node', 'bin.js'];
  const tex = 'tex';
  const file = 'file.svg';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('exits with error when no arguments are passed', async () => {
    process.argv = processArgv;
    const { result } = await import('../src/bin.js');
    await result;
    expect(processExitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('<tex> [file] [options]'),
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith('TeX string is required');
  });

  it('logs SVG to console when 1 argument is passed', async () => {
    process.argv = [...processArgv, tex];
    const { result } = await import('../src/bin.js');
    await result;
    expect(processExitSpy).not.toHaveBeenCalled();
    expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
    expect(consoleLogSpy).toHaveBeenCalledWith(tex);
  });

  it('disables SVG optimization with option --optimize=false', async () => {
    process.argv = [...processArgv, tex, '--optimize=false'];
    const { result } = await import('../src/bin.js');
    await result;
    expect(processExitSpy).not.toHaveBeenCalled();
    expect(texsvg).toHaveBeenCalledWith(tex, { optimize: false });
    expect(consoleLogSpy).toHaveBeenCalledWith(tex);
  });

  it('saves SVG to file when 2 arguments are passed', async () => {
    process.argv = [...processArgv, tex, file, file];
    const { result } = await import('../src/bin.js');
    await result;
    expect(processExitSpy).not.toHaveBeenCalled();
    expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalledWith(file, tex);
  });

  it('logs error to console if there is an exception', async () => {
    const error = 'Error';
    texsvg.mockRejectedValueOnce(error);
    process.argv = [...processArgv, tex];
    const { result } = await import('../src/bin.js');
    await result;
    expect(processExitSpy).not.toHaveBeenCalled();
    expect(texsvg).toHaveBeenCalledWith(tex, { optimize: true });
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
