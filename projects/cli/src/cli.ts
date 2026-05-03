#!/usr/bin/env bun

import yargs from 'yargs';

import pkg from '../package.json' with { type: 'json' };
import { greet } from './greet.js';
const cli = yargs(process.argv.slice(2)).scriptName('ncs').version(pkg.version).usage('$0 <cmd> [args]').strict();

cli.command(
  '$0',
  'show help',
  () => {},
  async () => {
    console.log(await cli.getHelp());
  }
);

void cli
  .command(
    'greet [message]',
    'create a greeting',
    builder => {
      return builder
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
      console.log(greet(argv.message, argv.capitalize));
    }
  )
  .parse();
