#!/usr/bin/env node

/* eslint-disable no-console */

import { writeFile } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import texsvg from '.';

const { _, optimize } = yargs(hideBin(process.argv))
  .usage('Usage: $0 <tex> [file] [options]')
  .command('<tex> [file]', 'Convert TeX to SVG', (yargs) =>
    yargs
      .positional('tex', {
        demandOption: true,
        describe: 'TeX string',
        type: 'string',
      })
      .positional('file', {
        describe: 'SVG file',
        type: 'string',
      }),
  )
  .demandCommand(1, 'TeX string is required')
  .options({
    optimize: {
      default: true,
      describe: 'Whether to optimize SVG',
      type: 'boolean',
    },
  })
  .parseSync();

const [tex, file] = _ as [string, string | undefined];

export = texsvg(tex, { optimize })
  .then((svg) => {
    // output svg to stdout if it's not going to be saved to a file
    if (!file) {
      console.log(svg);
      return;
    }

    return new Promise((resolve, reject) => {
      writeFile(file, svg, (error) => {
        /* istanbul ignore next */
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
