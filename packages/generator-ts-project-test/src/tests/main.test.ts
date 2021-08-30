import { ConvertibleFileMappingTesterTests } from "./ConvertibleFileMappingTester.test";
import { DependencyCollectionTesterTests } from "./DependencyCollectionTester.test";
import { InquiryTests } from "./Inquiry";
import { NPMIgnoreFileMappingTesterTests } from "./NPMIgnoreFileMappingTester.test";
import { PackageFileMappingTesterTests } from "./PackageFileMappingTester.test";
import { ParsableFileMappingTesterTests } from "./ParsableFileMappingTester.test";
import { ParsedFileMappingTesterTests } from "./ParsedFileMappingTester.test";
import { TestContextTests } from "./TestContext.test";
import { TypeScriptFileMappingTesterTests } from "./TypeScriptFileMappingTester.test";

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
