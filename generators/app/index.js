"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("name", { type: String, required: false });
    this.argument("binname", { type: String, required: false });
    this.argument("description", { type: String, required: false });
  }

  initializing() {}

  prompting() {
    this.log(yosay("Welcome to the " + chalk.blue("node-cli") + " generator!"));

    const prompts = [];

    if (!this.options.name) {
      prompts.push({
        type: "input",
        name: "name",
        message: "Command line app name"
      });
    }

    if (!this.options.binname) {
      prompts.push({
        type: "input",
        name: "binname",
        message: "Command line binary name"
      });
    }

    if (!this.options.description) {
      prompts.push({
        type: "input",
        name: "description",
        message: "Command line app description"
      });
    }

    return this.prompt(prompts).then(answer => {
      this.name = this.options.name || answer.name;
      this.binname = this.options.binname || answer.binname;
      this.description = this.options.description || answer.description;
      this.dir = this.name;
    });
  }

  configuring() {}

  default() {}

  get writing() {
    return {
      appStaticFiles() {
        const src = this.sourceRoot();
        const dest = this.destinationPath(this.dir);

        const files = [
          ".circleci",
          ".eslintrc",
          ".gitattributes",
          ".npmrc",
          ".nvmrc",
          ".prettierignore",
          ".prettierrc",
          "LICENSE.md",
          "README.md",
          "_.gitignore",
          "_package.json",
          "bin.js",
          "jest.config.js",
          "lib.js",
          "test.js"
        ];

        this.fs.copy(src, dest);
        this.fs.copy(this.templatePath(".*"), dest);

        const opts = {
          name: this.name,
          binname: this.binname,
          description: this.description
        };

        files.forEach(f => {
          this.fs.copyTpl(this.templatePath(f), this.destinationPath(`${this.dir}/${f}`), opts);
        });

        this.fs.move(
          this.destinationPath(`${this.dir}`, "_package.json"),
          this.destinationPath(`${this.dir}`, "package.json")
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "_.gitignore"),
          this.destinationPath(`${this.dir}`, ".gitignore")
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "bin.js"),
          this.destinationPath(`${this.dir}`, `bin/${this.binname}.js`)
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "lib.js"),
          this.destinationPath(`${this.dir}`, `lib/${this.binname}.js`)
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "test.js"),
          this.destinationPath(`${this.dir}`, `test/${this.binname}.test.js`)
        );
      }
    };
  }

  conflicts() {}

  install() {
    const appDir = path.join(process.cwd(), this.dir);
    process.chdir(appDir);
    this.yarnInstall();
  }

  end() {}
};
