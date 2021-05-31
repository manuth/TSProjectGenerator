# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## TSProjectGenerator [Unreleased]

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v2.0.4...dev)

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
  - `.json` and `.yml`-filemappings to include new lines at the end of files

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
  - The terminoloy of some file-processors

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

## Updated
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
  - A set of generators with custom additions (such as custom markdown-codestyle and drone-configuration)
  - Components for creating a similar generator

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/generator-ts-genmerator-v1.4.7...v1.0.0)
