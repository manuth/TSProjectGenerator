import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test";
import { ParsedFileMappingTesterTests } from "./ParsedFileMappingTester.test";

suite(
    "TSProjectGeneratorTest",
    () =>
    {
        ParsableFileMappingTesterTests();
        ConvertibleFileMappingTesterTests();
        ParsedFileMappingTesterTests();
    });
