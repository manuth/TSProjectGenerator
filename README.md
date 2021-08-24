# TSProjectGenerator
Provides two packages which allow you to create modules or generators written in TypeScript alongside a package for testing the generators.

## General
This project contains three packages:
  * [`@manuth/generator-ts-project`][TSProjectGenerator]:  
    Provides basic generator for creating modules and generators
  * [`@manuth/generator-my-ts-project`][MyTSProjectGenerator]:  
    Provides a good example on how to inherit an existing generator.  
    This set of generators contains some additions such as a custom markdown-codestyle and a Drone configuration file for continuous integration.
  * [`@manuth/generator-ts-project-test`][TSProjectGeneratorTest]:  
    Provides components for testing different kinds of file-mappings and other aspects of the generators provided by `TSProjectGenerator`.

<!--- References -->
[TSProjectGenerator]: ./packages/generator-ts-project
[MyTSProjectGenerator]: ./packages/generator-my-ts-project
[TSProjectGeneratorTest]: ./packages/generator-ts-project-test
