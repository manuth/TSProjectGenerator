import { ok } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { IPackageMetadata, Package } from "@manuth/package-json-editor";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { TSModulePackageFileMapping } from "../../../../../generators/module/FileMappings/NPMPackaging/TSModulePackageFileMapping.js";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TestContext } from "../../../../TestContext.js";

const { pathExists } = fs;

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
            let generator: TSModuleGenerator;
            let fileMapping: TestTSModulePackageFileMapping;
            let tester: PackageFileMappingTester<TSModuleGenerator, ITSProjectSettings, GeneratorOptions, TestTSModulePackageFileMapping>;

            /**
             * Provides an implementation of the {@link TSModulePackageFileMapping `TSModulePackageFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTSModulePackageFileMapping extends TSModulePackageFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The loaded package.
                 */
                public override async LoadPackage(): Promise<Package>
                {
                    return super.LoadPackage();
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    let npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");
                    generator = await context.Generator;
                    fileMapping = new TestTSModulePackageFileMapping(generator);
                    tester = new PackageFileMappingTester(generator, fileMapping);

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });

                    spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });
                });

            setup(
                async function()
                {
                    this.timeout(10 * 1000);
                    await tester.Run();
                });

            suite(
                nameof<TestTSModulePackageFileMapping>((fileMapping) => fileMapping.LoadPackage),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.main)}\`-file exists…`,
                        async function()
                        {
                            this.slow(2 * 1000);
                            ok(await pathExists(generator.destinationPath((await tester.ParseOutput()).Main)));
                        });

                    test(
                        `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.types)}\`-file exists…`,
                        async function()
                        {
                            this.slow(2 * 1000);
                            ok(await pathExists(generator.destinationPath((await tester.ParseOutput()).Types)));
                        });
                });
        });
}
