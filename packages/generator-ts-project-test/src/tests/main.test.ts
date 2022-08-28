import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test.js";
import { DependencyCollectionTesterTests } from "./DependencyCollectionTester.test.js";
import { InquiryTests } from "./Inquiry/index.js";
import { NPMIgnoreFileMappingTesterTests } from "./NPMIgnoreFileMappingTester.test.js";
import { PackageFileMappingTesterTests } from "./PackageFileMappingTester.test.js";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test.js";
import { ParsedFileMappingTesterTests } from "./ParsedFileMappingTester.test.js";
import { TestContextTests } from "./TestContext.test.js";
import { TypeScriptFileMappingTesterTests } from "./TypeScriptFileMappingTester.test.js";

suite(
    "TSProjectGeneratorTest",
    () =>
    {
        InquiryTests();
        TestContextTests();
        ParsableFileMappingTesterTests();
        ConvertibleFileMappingTesterTests();
        ParsedFileMappingTesterTests();
        NPMIgnoreFileMappingTesterTests();
        TypeScriptFileMappingTesterTests();
        PackageFileMappingTesterTests();
        DependencyCollectionTesterTests();
    });
