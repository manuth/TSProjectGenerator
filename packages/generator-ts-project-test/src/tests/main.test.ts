import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test";

suite(
    "TSProjectGeneratorTest",
    () =>
    {
        ParsableFileMappingTesterTests();
        ConvertibleFileMappingTesterTests();
    });
