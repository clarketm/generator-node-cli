"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-node-cli:app", () => {
  let name, binName, description;

  beforeAll(() => {
    name = "jwt-utils";
    binName = "jwt";
    description = "Command line utilities for working with JSON Web Tokens (JWT)";

    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ name, binName, description });
  });

  it("should creates files", () => {
    assert.file([
      ".circleci/config.yml",
      ".eslintrc",
      ".gitattributes",
      ".npmrc",
      ".nvmrc",
      ".prettierignore",
      ".prettierrc",
      "LICENSE.md",
      "README.md",
      ".gitignore",
      "package.json",
      `bin/${binName}.js`,
      `lib/${binName}.js`,
      `test/${binName}.test.js`,
      "jest.config.js"
    ]);
  });

  it("should customize README.md", () => {
    assert.fileContent("README.md", `# ${name}`);
  });

  it("should customize package.json", () => {
    assert.fileContent([
      ["package.json", `"name": "@clarketm/${name}",`],
      ["package.json", `"description": "${description}",`],
      ["package.json", `"main": "./lib/${binName}.js",`],
      ["package.json", `"${binName}": "./bin/${binName}.js"`],
      ["package.json", `"homepage": "https://github.com/clarketm/${name}#readme",`]
    ]);
  });
});
