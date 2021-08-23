# TSProjectGeneratorTest
Provides the functionality to test `TSProjectGenerator`-components

## Getting Started
To get started with `TSProjectGeneratorTest`, install the package using following command:

```bash
npm install --save @manuth/generator-ts-project-test
```

## Usage
This package provides components for testing a few different types of file-mappings and `DependencyCollection`s.

### Testing `DependencyCollection`s
The `DependencyCollectionTester` class provides methods for asserting the existence of dependencies.

#### The `DependencyCollectionTester.AssertDependencies`-Method
Assert the existence and the versions of the dependencies in the `DependencyCollection`.

#### The `DependencyCollectionTester.AssertDependencyNames`-Method
Assert the existence of dependencies based on their names.

### Testing `FileMapping`s
#### Testing `FileMapping`s for `package.json`-Files
On top of the functionality of the `DependencyCollectionTester`, the `PackageFileMappingTester` also provides a method for checking `package.json`-scripts.

##### The `PackageFileMappingTester.AssertScript`-Method
Asserts the nature of the script with the specified `name`.

#### Testing `FileMapping`s for `.npmignore`-Files
The `NPMIgnoreFileMappingTester` provides features for testing whether the expected files are ignored.

##### The `NPMIgnoreFileMappingTester.GetFileList`-Method
Gets the names of the absolute paths to the included files.

##### The `NPMIgnoreFileMappingTester.AssertIgnored`-Method
Asserts that the file located at the specified `path` either is or is not ignored.

##### The `NPMIgnoreFileMappingTester.AssertDirectoryIgnored`-Method
Asserts that the directory located at the specified `path`, alongside its sub-directories and files, either is or is not ignored.

#### Testing TypeScript-Files
The `TypeScriptFileMappingTester` provides the functionality for emitting and `require`-ing the underlying output-file on-the-fly using the `TypeScriptFileMappingTester.Require`-method.

#### Testing Convertible Files
`ConvertibleFileMapping`s which parse and dump files, such as the `TypeScriptFileMappingTester`, the `YAMLFileMappingTester` or the `JSONCFileMappingTester` provide methods for parsing and dumping content of their corresponding files.

##### The `ConvertibleFileMappingTester.Parse`-Method
Allows the user to get the parsed value of the specified `text`.

##### The `ConvertibleFileMappingTester.ParseSource`-Method
Parses the text in the source-file.

##### The `ConvertibleFileMappingTester.ParseOutput`-Method
Parses the text in the output-file.

##### The `ConvertibleFileMappingTester.Dump`-Method
Dumps the specified `data` as text.

##### The `ConvertibleFileMappingTester.DumpFile`-Method
Dumps the text-representation of the specified `data` to a file with the specified `fileName`.

##### The `ConvertibleFileMappingTester.DumpSource`-Method
Dumps the specified `data` to the source-file.

##### The `ConvertibleFileMappingTester.DumpOutput`-Method
Dumps the specified `data` to the output-file.
