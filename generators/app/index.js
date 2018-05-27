"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.name = {
      type: String,
      required: false,
      desc: "Command line app name"
    };

    this.binName = {
      type: String,
      alias: "b",
      desc: "Command line binary name"
    };

    this.description = {
      type: String,
      alias: "d",
      desc: "Command line app description"
    };

    this.argument("name", this.name);
    this.option("binName", this.binName);
    this.option("description", this.description);
  }

  initializing() {}

  prompting() {
    this.log(yosay("Welcome to the " + chalk.blue("node-cli") + " generator!"));

    let prompts = [];

    if (!this.options.name) {
      prompts.unshift({
        type: "input",
        name: "name",
        message: this.name.desc
      });
    }

    return this.prompt(prompts).then(answer => {
      this.name = this.options.name || answer.name;
      this.dir = this.name;

      prompts = [];

      if (!this.options.description) {
        prompts.unshift({
          type: "input",
          name: "description",
          message: this.description.desc,
          default: "Command line tool"
        });
      }

      if (!this.options.binName) {
        prompts.unshift({
          type: "input",
          name: "binName",
          message: this.binName.desc,
          default: this.name
        });
      }

      return this.prompt(prompts).then(answer => {
        this.binName = this.options.binName || answer.binName;
        this.description = this.options.description || answer.description;
      });
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
          "t.js"
        ];

        this.fs.copy(src, dest);
        this.fs.copy(this.templatePath(".*"), dest);

        const opts = {
          name: this.name,
          binName: this.binName,
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
          this.destinationPath(`${this.dir}`, `bin/${this.binName}.js`)
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "lib.js"),
          this.destinationPath(`${this.dir}`, `lib/${this.binName}.js`)
        );

        this.fs.move(
          this.destinationPath(`${this.dir}`, "t.js"),
          this.destinationPath(`${this.dir}`, `test/${this.binName}.test.js`)
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
