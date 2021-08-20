import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test";
import { DependencyCollectionTesterTests } from "./DependencyCollectionTester.test";
import { NPMIgnoreFileMappingTesterTests } from "./NPMIgnoreFileMappingTester.test";
import { PackageFileMappingTesterTests } from "./PackageFileMappingTester.test";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test";
import { ParsedFileMappingTesterTests } from "./ParsedFileMappingTester.test";
import { TypeScriptFileMappingTesterTests } from "./TypeScriptFileMappingTester.test";

suite(
    "TSProjectGeneratorTest",
    () =>
    {
        ParsableFileMappingTesterTests();
        ConvertibleFileMappingTesterTests();
        ParsedFileMappingTesterTests();
        NPMIgnoreFileMappingTesterTests();
        TypeScriptFileMappingTesterTests();
        PackageFileMappingTesterTests();
        DependencyCollectionTesterTests();
    });
