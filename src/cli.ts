#!/usr/bin/env bun

import yargs from 'yargs';

import pkg from '../package.json' with { type: 'json' };
import { capitalize } from './capitalize.js';
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
      const capitalized = capitalize(greeting, Boolean(argv.capitalize));
      console.log(`hello, ${capitalized}!`);
    }
  )
  .parse();
