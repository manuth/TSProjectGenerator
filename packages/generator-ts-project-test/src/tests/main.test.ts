import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test";
import { NPMIgnoreFileMappingTesterTests } from "./NPMIgnoreFileMappingTester.test";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test";
import { ParsedFileMappingTesterTests } from "./ParsedFileMappingTester.test";

suite(
    "TSProjectGeneratorTest",
    () =>
    {
        ParsableFileMappingTesterTests();
        ConvertibleFileMappingTesterTests();
        ParsedFileMappingTesterTests();
        NPMIgnoreFileMappingTesterTests();
    });
