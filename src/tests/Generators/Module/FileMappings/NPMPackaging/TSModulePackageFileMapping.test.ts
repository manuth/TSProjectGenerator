import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { pathExists } from "fs-extra";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings";
import { TSModulePackageFileMapping } from "../../../../../generators/module/FileMappings/NPMPackaging/TSModulePackageFileMapping";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator";
import { PackageFileMappingTester } from "../../../../NPMPackaging/FileMappings/PackageFileMappingTester";

/**
 * Registers tests for the `TSModulePackageFileMapping`.
 *
 * @param context
 * The test-context.
 */
export function TSModulePackageFileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModulePackageFileMapping",
        () =>
        {
            let fileMapping: TSModulePackageFileMapping<ITSProjectSettings>;
            let tester: PackageFileMappingTester<TSModuleGenerator, ITSProjectSettings, TSModulePackageFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSModulePackageFileMapping(await context.Generator);
                    tester = new PackageFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether the `main`-file exists…",
                async () =>
                {
                    Assert.ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Main)));
                });

            test(
                "Checking whether the `types`-file exists…",
                async () =>
                {
                    Assert.ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Types)));
                });
        });
}
