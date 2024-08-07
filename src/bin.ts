#!/usr/bin/env node

/* eslint-disable no-console */

import { writeFile } from 'fs';
import texsvg from '.';

const [tex, file] = process.argv.slice(2);

if (!tex) {
  console.error('Usage: texsvg <tex> <file>');
  process.exit(9);
}

export = texsvg(tex)
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
