# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## TSProjectGenerator [Unreleased]
### Added
  - A feature for creating `CHANGELOG` files for new projects
  - A feature to set the default package-name to the name of the existing package

### Updated
  - The development environment
  - The format of transformed JSON and YAML files
  - All dependencies
  - The typescript-configuration for tests

[Show differences](https://github.com/manuth/TSProjectGenerator/compare/v1.1.4...dev)

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
