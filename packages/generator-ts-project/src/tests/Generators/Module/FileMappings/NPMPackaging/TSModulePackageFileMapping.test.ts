import { ok, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { IPackageMetadata, Package, ResolveMatrix } from "@manuth/package-json-editor";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { TSModulePackageFileMapping } from "../../../../../generators/module/FileMappings/NPMPackaging/TSModulePackageFileMapping.js";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey.js";
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
            let defaultName = "default";
            let typeName = "types";
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

            /**
             * Sets the value indicating whether an ESModule project should be generated.
             *
             * @param value
             * The value to set.
             */
            function SetESModule(value: boolean): void
            {
                generator.Settings[TSProjectSettingKey.ESModule] = value;
            }

            suite(
                nameof<TestTSModulePackageFileMapping>((fileMapping) => fileMapping.LoadPackage),
                () =>
                {
                    /**
                     * Gets the {@link Package `Package`} generated by the filemapping.
                     *
                     * @returns
                     * The {@link Package `Package`} generated by the filemapping.
                     */
                    async function GetPackage(): Promise<Package>
                    {
                        return fileMapping.LoadPackage();
                    }

                    /**
                     * Gets the main {@link ResolveMatrix `ResolveMatrix`} from the generated {@link Package `Package`}.
                     */
                    async function GetExports(): Promise<ResolveMatrix>
                    {
                        /**
                         * Gets a child matrix from the specified {@link matrix `matrix`} with the specified {@link sectionName `sectionName`}.
                         *
                         * @param matrix
                         * The matrix to get the child matrix from.
                         *
                         * @param sectionName
                         * The name of the section to get.
                         *
                         * @returns
                         * The child {@link ResolveMatrix `ResolveMatrix`} at the specified {@link sectionName `sectionName`}.
                         */
                        function GetMatrix(matrix: ResolveMatrix, sectionName: string): ResolveMatrix
                        {
                            let result = matrix[sectionName];
                            IsMatrix(result);
                            return result;
                        }

                        /**
                         * Asserts that the specified {@link value `value`} is a matrix.
                         *
                         * @param value
                         * The value to check.
                         */
                        function IsMatrix(value: string | string[] | ResolveMatrix): asserts value is ResolveMatrix
                        {
                            ok(typeof value !== "string");
                            ok(!Array.isArray(value));
                        }

                        let npmPackage = await GetPackage();
                        let exports = npmPackage.Exports;
                        IsMatrix(exports);
                        let mainExports = GetMatrix(exports, ".");

                        if (generator.Settings[TSProjectSettingKey.ESModule])
                        {
                            mainExports = GetMatrix(mainExports, "import");
                        }

                        return mainExports;
                    }

                    test(
                        `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.main)}\`-file exists…`,
                        async function()
                        {
                            this.slow(2 * 1000);
                            ok(await pathExists(generator.destinationPath((await GetPackage()).Main)));
                        });

                    test(
                        `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.types)}\`-file exists…`,
                        async function()
                        {
                            this.slow(2 * 1000);
                            ok(await pathExists(generator.destinationPath((await GetPackage()).Types)));
                        });

                    test(
                        `Checking whether the types and the entrypoint are declared in the \`${nameof<IPackageMetadata>((pkg) => pkg.exports)}\` field…`,
                        async function()
                        {
                            this.slow(2 * 1000);
                            let npmPackage = await GetPackage();

                            for (let esModule of [true, false])
                            {
                                SetESModule(esModule);
                                let specifiers = await GetExports();
                                strictEqual(specifiers[defaultName], npmPackage.Main);
                                strictEqual(specifiers[typeName], npmPackage.Types);
                            }
                        });

                    test(
                        `Checking whether the \`${nameof<IPackageMetadata>((pkg) => pkg.exports)}\`-declarations appear in the correct order…`,
                        async function()
                        {
                            this.slow(2 * 1000);

                            for (let esModule of [true, false])
                            {
                                SetESModule(esModule);
                                let envNames = Object.keys(await GetExports());
                                ok(envNames.indexOf(typeName) < envNames.indexOf(defaultName));
                            }
                        });
                });
        });
}
