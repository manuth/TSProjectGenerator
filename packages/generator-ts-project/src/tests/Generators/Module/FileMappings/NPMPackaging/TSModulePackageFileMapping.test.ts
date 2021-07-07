import { ok } from "assert";
import { spawnSync } from "child_process";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { IRunContext } from "@manuth/extended-yo-generator-test";
import { IPackageMetadata, Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import npmWhich = require("npm-which");
import { TSModulePackageFileMapping } from "../../../../../generators/module/FileMappings/NPMPackaging/TSModulePackageFileMapping";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings";
import { PackageFileMappingTester } from "../../../../NPMPackaging/FileMappings/PackageFileMappingTester";
import { TestContext } from "../../../../TestContext";

/**
 * Registers tests for the {@link TSModulePackageFileMapping `TSModulePackageFileMapping<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function TSModulePackageFileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        nameof(TSModulePackageFileMapping),
        () =>
        {
            let runContext: IRunContext<TSModuleGenerator>;
            let fileMapping: TSModulePackageFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TSModuleGenerator, ITSProjectSettings, GeneratorOptions, TSModulePackageFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    runContext = context.ExecuteGenerator();
                    await runContext.toPromise();
                    fileMapping = new TSModulePackageFileMapping(runContext.generator);
                    tester = new PackageFileMappingTester(runContext.generator, fileMapping);

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: runContext.generator.destinationPath()
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: runContext.generator.destinationPath()
                        });
                });

            suiteTeardown(
                function()
                {
                    this.timeout(1 * 60 * 1000);
                    runContext.cleanTestDirectory();
                });

            test(
                `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.main)}\`-file exists…`,
                async function()
                {
                    this.slow(2 * 1000);
                    ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Main)));
                });

            test(
                `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.types)}\`-file exists…`,
                async function()
                {
                    this.slow(2 * 1000);
                    ok(await pathExists(tester.Generator.destinationPath((await tester.Package).Types)));
                });
        });
}
