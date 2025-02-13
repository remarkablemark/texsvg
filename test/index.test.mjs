import { describe, it } from 'node:test';

import assert from 'assert';

import texsvg from '../cjs/index.js';

describe('texsvg', () => {
  it('exports function', () => {
    assert.strictEqual(typeof texsvg, 'function');
  });

  it('converts TeX to SVG', async () => {
    assert.equal(
      await texsvg(''),
      '<svg style="vertical-align:0" xmlns="http://www.w3.org/2000/svg" width=".036ex" height=".036ex" viewBox="0 0 16 16"/>',
    );
  });
});
