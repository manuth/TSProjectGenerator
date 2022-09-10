# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## TSProjectGenerator [Unreleased]
### Updated
  - Generators to strip unnecessary settings from `tsconfig.json` files

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v4.0.1...dev)

## TSProjectGenerator v4.0.1
### MyTSProjectGenerator
#### Fixed
  - The package for the use on windows systems

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v4.0.0...v4.0.1)

## TSProjectGenerator v4.0.0
### General
#### Updated
  - All packages to `ESModule`s
  - All dependencies
  - Generators to add an `exports` field to generated `package.json` files
  - Generators to also add a `type` field to generated `package.json` files
  - Generators to emit TypeScript code which do not break any linting rule

#### Added
  - The ability to create `ESModule` projects
  - An option to choose whether to create a `CommonJS` or an `ESModule` project
  - An option to skip the `cleanup`-task at the end of running a generator
  - The ability to generate mocha files which are exposed as functions rather than direct `suite`-calls
  - Steps to the `.drone.yml` file for checking whether all authentication tokens are working

### TSProjectGenerator
#### Updated
  - Tests to be less performance heavy

#### Added
  - Support for generating yeoman-generator dependencies for generators written in both `ESModule` and `CommonJS`

### TSProjectGeneratorTest
#### Added
  - A method to the `TypeScriptFileMappingTester` for `import`ing and `default` `import`ing `.ts` files on the fly

### MyTSProjectGenerator
#### Removed
  - Support for creating dependabot files

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.1.0...v4.0.0)

## TSProjectGenerator v3.1.0
### Updated
  - All dependencies

### Fixed
  - A few typos
  - Formatting issues in `@manuth/generator-ts-project`s markdown files

### Added
  - Steps to the drone-pipeline for verifying the `CHANGELOG.md` file and all access tokens
  - The `DependabotFileMapping` to the exported classes of `@manuth/generator-my-ts-project`

### Removed
  - Unnecessary dependencies
  - Unnecessary npm scripts

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.13...v3.1.0)

## TSProjectGenerator v3.0.13
### Fixed
  - Broken creation of the `extensions.json` file

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.12...v3.0.13)

## TSProjectGenerator v3.0.12
### Fixed
  - Broken drone pipeline creation
  - Incorrect `test` npm script
  - Creation of vscode debug settings

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.11...v3.0.12)

## TSProjectGenerator v3.0.11
### Fixed
  - Vulnerabilities in dependencies
  - Settings disallowing the use of vscode's integrated terminal

### Updated
  - All dependencies
  - Linting environment
  - Unit tests for lowering the memory consumption

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.10...v3.0.11)

## TSProjectGenerator v3.0.10
### Updated
  - All dependencies
  - The `.eslintrc.js`-file creation to strip the unwanted `ignorePatterns`-setting
  - Broken `@manuth/extended-yo-generator`-dependency

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.9...v3.0.10)

## TSProjectGenerator v3.0.9
### Added
  - Missing exports to the `@manuth/generator-ts-project-test`-package

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.8...v3.0.9)

## TSProjectGenerator v3.0.8
### Added
  - Components for testing prompts

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.7...v3.0.8)

## TSProjectGenerator v3.0.7
### Added
  - Missing components to the export-list of the `@manuth/generator-ts-project`-module

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.6...v3.0.7)

## TSProjectGenerator v3.0.6
### Fixed
  - Broken type-declarations for the `QuestionSetPrompt`

### Added
  - Tests for the type-declarations

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.5...v3.0.6)

## TSProjectGenerator v3.0.5
### Fixed
  - The `PathPrompt`s treatment of trailing backslashes on linux
  - Broken unit-tests

### Added
  - Support for getting all answers from within a `QuestionSetPrompt`

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.4...v3.0.5)

## TSProjectGenerator v3.0.4
### Added
  - Missing exports

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.3...v3.0.4)

## TSProjectGenerator v3.0.3
### Fixed
  - Broken tests

### Updated
  - Broken dependencies
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.2...v3.0.3)

## TSProjectGenerator v3.0.2
### Updated
  - Broken dependency

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.1...v3.0.2)

## TSProjectGenerator v3.0.1
### Added
  - Missing dependency to `@manuth/generator-my-ts-project` for the use of `ts-patch`

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v3.0.0...v3.0.1)

## TSProjectGenerator v3.0.0
### Breaking
  - Replaced the `PackageFileMapping.Template`-property with `PackageFileMapping.SourcePackage` for loading scripts and `PackageFileMapping.GetSourceObject` for loading the source-object of the `PackageFileMapping`
  - Replaced the `PackageFileMapping.Package`-property with a `PackageFileMapping.GetPackage`-method
  - Made the `PackageFileMapping.ScriptMappings`-property synchronous
  - Changed `ScriptCollectionEditor`-constructor to require passing a `Package`
  - Changed `ScriptMapping`-constructor to require passing a `Package`
  - Refactored `MyTSProjectPackageFileMapping`
    - The `MyTSProjectPackageFileMapping` now can extend any `TSProjectPackageFileMapping`
    - The `MyTSProjectPackageFileMapping`-constructor now requires passing a `TSProjectPackageFileMapping`
  - Removed `QuestionBase`, `ComponentBase`, `ComponentCategoryBase`, `ComponentCollectionBase` and `FileMappingBase` in favor of `@manuth/extended-yo-generator`s corresponding classes
  - Replaced the `TransformFileMapping`-class with `Converter`s such as the `JSONCConverter`, the `YAMLConverter` or the `TypeScriptConverter`
  - Replaced the `Metadata`-property of `DumpFileMapping`s with `GetSourceObject`
  - Renamed `JSONCreatorMapping` to `JSONCCreatorMapping`
  - Renamed `JSONTransformMapping` to `JSONCTransformMapping`
  - Changed `PackageFileMapping` to load the source-object from the `PackageFileMapping.Source` if it exists
  - Replaced the `CodeWorkspaceComponent.WorkspaceMetadata`-property with the `CodeWorkspaceComponent.GetWorkspaceMetadata`-method
  - Replaced the `CodeWorkspaceProvider.WorkspaceMetadata`-property with the `CodeWorkspaceProvider.GetWorkspaceMetadata`-method
  - Rename the `TSGeneratorLaunchSettingsProcessor`s `GetTemplateMetadata`-method to `GetYeomanTemplate`

### Fixed
  - Vulnerabilities in dependencies
  - Drone-pipelines by preventing publish-scripts from interrupting each other
  - Broken release-notes script in drone-pipelines

### Added
  - A new package `@manuth/generator-ts-project-test` which provides components for testing the generators
    - This new packages provides components for testing file-mappings
    - Also provides components for testing `DependencyCollection`s and their content
  - Support for the Test Explorer UI
  - Support for `ts-nameof`
  - A `NestedPrompt` class for asking nested questions
  - A class `SuspendablePrompt` for temporarily releasing the `ReadLine`-instance while asking questions
  - A class `QuestionSetPrompt` for asking a set of questions
  - A class `ArrayPrompt` for asking for an array of values
  - A class `PathPrompt` for asking for a file-system path
  - A new property `PackageFileMapping.Keywords` for adding keywords to the generated file

### Updated
  - All dependencies
  - `TypeScriptTransformMapping` to format the code after transforming the content
  - TypeScript-`FileMapping`s in order to dynamically generate TypeScript-files instead of using `EJS`-templates
    - This change has a big performance cost and might cause the generator to be stuck for a few settings before actually writing the files to the file-system

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.4...v3.0.0)

## TSProjectGenerator v2.0.4
### Added
  - New unit-tests

### Updated
  - The unit-tests
  - All dependencies

### Fixed
  - The `settings.json`-creation of the `TSProjectGenerator`

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.3...v2.0.4)

## TSProjectGenerator v2.0.3
### Updated
  - All dependencies
  - Templates to include tests for each created generator
  - Test-timeouts

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.2...v2.0.3)

## TSProjectGenerator v2.0.2
### Fixed
  - Incorrect dependencies

### Updated
  - The settings in order to improve the debug experience
  - All dependencies
  - The `npm`-installation process of the generators

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.1...v2.0.2)

## TSProjectGenerator v2.0.1
### Fixed
  - ReDoS-threats

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.0...v2.0.1)

## TSProjectGenerator v2.0.0
### Breaking
  - Updated `@manuth/extended-yo-generator` which requires `yo@4.0.0^` to be installed in order to use the generators

### Updated
  - All dependencies

### Removed
  - Redundant dependabot-settings
  - Unnecessary dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.3.1...v2.0.0)

## TSProjectGenerator v1.3.1
### Fixed
  - Broken drone-pipelines
  - Broken vscode-settings

### Added
  - A workflow for merging Dependabot-PRs
  - A workflow for analyzing the code
  - A feature for adding the new workflows to the generated packages

### Updated
  - All dependencies
  - Drone-pipelines to use small-sized images
  - IntelliSense to improve the development environment
  - The template of the mocha-tests
  - Lifecycle-scripts for fastening `npm install`

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.3.0...v1.3.1)

## TSProjectGenerator v1.3.0
### Updated
  - Dependencies for fixing installation-errors

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.2.2...v1.3.0)

## TSProjectGenerator v1.2.2
### Fixed
  - All vulnerabilities

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.2.1...v1.2.2)

## TSProjectGenerator v1.2.1
### Added
  - Missing exports

### Fixed
  - Broken Dependabot-settings
  - Typos

### Updated
  - All dependencies
  - TypeScript-settings

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.2.0...v1.2.1)

## TSProjectGenerator v1.2.0
### Added
  - A feature for creating `CHANGELOG` files for new projects
  - A feature to set the default package-name to the name of the existing package
  - New unit-tests

### Updated
  - The development environment
  - The format of transformed JSON and YAML files
  - All dependencies
  - The typescript-configuration for tests
  - The `.npmignore` file to exclude the `.github` directory
  - `.json` and `.yml` file-mappings to include new lines at the end of files

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.4...v1.2.0)

## TSProjectGenerator v1.1.4
### Updated
  - The `.eslintrc.js`-file to exclude redundant rule-configurations

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.3...v1.1.4)

## TSProjectGenerator v1.1.3
### Added
  - A dependabot configuration
  - The feature to generate a dependabot configuration using the `MyTSProjectGenerator`

### Updated
  - All dependencies
  - The coding-style
  - The markdown-processing for the `MyTSProjectGenerator`

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.2...v1.1.3)

## TSProjectGenerator v1.1.2
### Fixed
  - Malformed markdown-files
  - Task execution order

### Updated
  - All packages

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.1...v1.1.2)

## TSProjectGenerator v1.1.1
### Fixed
  - Fixed broken `.gitignore` file creation

### Updated
  - The code for creating `launch.json` files
  - The terminology of some file-processors

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.0...v1.1.1)

## TSProjectGenerator v1.1.0
### Added
  - Statements to the generated `package.json` files which ensure the package is published with public access

### Updated
  - All dependencies

### Fixed
  - Slow tests by increasing timeouts

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.0.3...v1.1.0)

## TSProjectGenerator v1.0.3
### Fixed
  - Errors due to incorrect imports
  - Errors due to the `cleanup` task being scoped incorrectly

### Updated
  - All packages

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.0.2...v1.0.3)

## TSProjectGenerator v1.0.2
### Fixed
  - Fix the creation of `.gitignore` files
  - Malformed and inexistent imports
  - Fix the creation of `.drone.yml` files
  - Errors due to missing dependencies
  - Errors during the `cleanup`-task due to `.eslintrc.js` being placed incorrectly

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.0.1...v1.0.2)

## TSProjectGenerator v1.0.1
### Updated
  - All dependencies

### Fixed
  - Incorrect drone-pipeline
  - GitHub Packages mechanism

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.0.0...v1.0.1)

## TSProjectGenerator v1.0.0
Initial release

### Added
  - A package for generating generators and modules written in TypeScript
  - A set of generators with custom additions (such as custom markdown code style and drone-configuration)
  - Components for creating a similar generator

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/generator-ts-genmerator-v1.4.7...v1.0.0)
