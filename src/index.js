#!/usr/bin/env node
import { createReadStream, writeFileSync } from 'fs';
import { inspect } from 'util';
import { join, dirname } from 'path';
import csvParser from 'csv-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';
import chalk from 'chalk';

const log = console.log;
const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = yargs(hideBin(process.argv)).argv;

log(chalk.green('Starting...'));

async function parseCSV() {
  const results = [];

  createReadStream(join(__dirname, '..', argv.file))
    .pipe(csvParser({ separator: '\n' }))
    .on('data', (data) => {
      const id = new ObjectId(Object.values(data)[0]);
      results.push(id);
    })
    .on('end', () => {
      console.log(inspect(results, { maxArrayLength: null }));
      writeFileSync(
        join(__dirname, '..', `${argv.file}.txt`),
        JSON.stringify(results),
      );
      log(chalk.green('There you go Sir! OMG, very big array!'));
    });
}

parseCSV();
