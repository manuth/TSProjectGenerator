# TSGeneratorGenerator
A Generator for Yeoman Generators Written in TypeScript

## Usage
### Install TSGeneratorGenerator
You can install `TSGeneratorGenerator` using the following command:

```bash
npm install -g yo generator-ts-generator
```

### Generate a Generator Written in TypeScript
You can create a generator written in TypeScript using this command:

```bash
yo ts-generator
```

It is recommended to use an intelligent code-editor which is meant to be used with TypeScript (like, for example VSCode or Atom).  
Please make sure to tick the `Example Generator`-box to generate a nice example for you to see the best practices for authoring generators.

## Generator Output
  - A basic folder-structure for keeping `TypeScript`-code and `JavaScript`-builds separate
  - Linting-rules (optional)
    - Either weak rules...
    - ...or strong rules
  - A node-package with required dependencies
  - Mocha test-environment
  - NPM-Scripts for...
    - Compiling the TypeScript-code
    - Cleaning compiled TypeScript-code
    - Linting the package
    - Testing the package using Mocha
 - Visual Studio Code workspace (optional)
    - Settings
    - Task for building the generator (by pressing <kbd>CTRL</kbd>, <kbd>SHIFT</kbd> + <kbd>B</kbd>)
    - Task for linting the generator
    - Debug-settings
 - Generator-Examples (optional)  
   You may want to create some generator-examples.  
   These will help you to learn more about the capabilities of the object-oriented implementation of the Yeoman-Generator.
