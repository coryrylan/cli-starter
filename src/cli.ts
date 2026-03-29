#!/usr/bin/env bun

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yargs from 'yargs';

const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, '..', 'package.json'), 'utf-8'));
const cli = yargs(process.argv.slice(2)).scriptName('ncs').version(pkg.version).usage('$0 <cmd> [args]');

cli.command(
  '$0',
  'show help',
  () => {},
  async () => {
    console.log(await cli.getHelp());
  }
);

cli
  .command(
    'greet [message]',
    'create a greeting',
    yargs => {
      return yargs
        .positional('message', {
          describe: 'message to greet',
          type: 'string'
        })
        .option('capitalize', {
          alias: 'c',
          type: 'boolean',
          description: 'Capitalize the message'
        });
    },
    argv => {
      const greeting = argv.message ?? 'world';
      const capitalized = argv.capitalize ? greeting.toUpperCase() : greeting;
      console.log(`hello, ${capitalized}!`);
    }
  )
  .parse();
