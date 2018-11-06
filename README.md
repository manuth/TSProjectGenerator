# TSGeneratorGenerator
A Generator for Yeoman Generators Written in TypeScript.

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

## Generator Output
  - A basic folder-structure for keeping `TypeScript`-code and `JavaScript`-builds separate
  - Linting-rules (optional)
    - Either weak rules...
    - ...or strong rules
  - A node-package with required dependencies
  - Mocha test-environment
  - NPM-Scripts for...
    - Compiling the TypeScript-code
    - Linting the package
    - Testing the package using
 - Visual Studio Code workspace (optional)
    - Settings
    - Task for building the generator (by pressing <kbd>CTRL</kbd>, <kbd>SHIFT</kbd> + <kbd>B</kbd>)
    - Task for linting the generator
    - Debug-settings 