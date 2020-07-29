import Assert = require("assert");
import { spawnSync } from "child_process";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { pathExists } from "fs-extra";
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
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
            let tempDir: TempDirectory;
            let fileMapping: TSModulePackageFileMapping<ITSProjectSettings>;
            let tester: PackageFileMappingTester<TSModuleGenerator, ITSProjectSettings, TSModulePackageFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    tempDir = new TempDirectory();
                    let runContext = context.ExecuteGenerator();
                    runContext.inDir(tempDir.FullName);
                    await runContext.toPromise();
                    let generator = runContext.generator;
                    fileMapping = new TSModulePackageFileMapping(generator);
                    tester = new PackageFileMappingTester(generator, fileMapping);

                    spawnSync(
                        npmWhich(generator.destinationPath()).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });
                });

            test(
                "Checking whether the `main`-file exists…",
                async function()
                {
                    this.slow(2 * 1000);
                    Assert.ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Main)));
                });

            test(
                "Checking whether the `types`-file exists…",
                async function()
                {
                    this.slow(2 * 1000);
                    Assert.ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Types)));
                });
        });
}
