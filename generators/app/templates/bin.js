#!/usr/bin/env node

"use strict";

const commander = require("commander");
const { version } = require("../package.json");
const { error } = console;
const { exit, argv } = process;

commander.version(version).on("command:*", () => {
  error(`Invalid command: ${commander.args.join(" ")}\nSee --help for a list of available commands.`);
  exit(1);
});

commander
  .command()
  .description()
  .option()
  .action();

commander.parse(argv);

if (!argv.slice(2).length) {
  commander.outputHelp(help => help);
}
