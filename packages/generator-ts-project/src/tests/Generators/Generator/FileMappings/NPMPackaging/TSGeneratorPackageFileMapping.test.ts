import { ok, strictEqual } from "assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { Package } from "@manuth/package-json-editor";
import { TSGeneratorDependencies } from "../../../../../generators/generator/Dependencies/TSGeneratorDependencies";
import { TSGeneratorExampleDependencies } from "../../../../../generators/generator/Dependencies/TSGeneratorExampleDependencies";
import { TSGeneratorPackageFileMapping } from "../../../../../generators/generator/FileMappings/NPMPackaging/TSGeneratorPackageFileMapping";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../../TestContext";

/**
 * Registers tests for the {@link TSGeneratorPackageFileMapping `TSGeneratorPackageFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorPackageFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorPackageFileMapping),
        () =>
        {
            let yeomanKeyword = "yeoman-generator";
            let fileMappingOptions: TSGeneratorPackageFileMapping<ITSGeneratorSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TSGeneratorGenerator, ITSGeneratorSettings, GeneratorOptions, TSGeneratorPackageFileMapping<ITSGeneratorSettings, GeneratorOptions>>;

            /**
             * Provides an implementation of the {@link TSGeneratorPackageFileMapping `TSGeneratorPackageFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTSGeneratorPackageFileMapping extends TSGeneratorPackageFileMapping<any, any>
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
                    fileMappingOptions = new TSGeneratorPackageFileMapping(await context.Generator);
                    tester = new PackageFileMappingTester(await context.Generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    await tester.Clean();
                });

            suite(
                nameof<TestTSGeneratorPackageFileMapping>((fileMapping) => fileMapping.LoadPackage),
                () =>
                {
                    suite(
                        nameof<Package>((pkg) => pkg.Keywords),
                        () =>
                        {
                            test(
                                `Checking whether the \`${yeomanKeyword}\`-keyword is added if it doesn't exist…`,
                                async function()
                                {
                                    this.slow(1 * 1000);

                                    await tester.DumpOutput(
                                        new Package(
                                            {
                                                keywords: []
                                            }));

                                    await tester.Run();
                                    ok((await tester.ParseOutput()).Keywords.includes(yeomanKeyword));

                                    await tester.DumpOutput(
                                        new Package(
                                            {
                                                keywords: [yeomanKeyword]
                                            }));

                                    await tester.Run();

                                    strictEqual(
                                        (await tester.ParseOutput()).Keywords.filter(
                                            (keyword) =>
                                            {
                                                return keyword === yeomanKeyword;
                                            }).length,
                                        1);
                                });
                        });

                    suite(
                        nameof<Package>((pkg) => pkg.Dependencies),
                        () =>
                        {
                            suite(
                                nameof(TSGeneratorDependencies),
                                () =>
                                {
                                    test(
                                        `Checking whether common dependencies for \`${nameof(TSGeneratorGenerator)}\`s are present…`,
                                        async function()
                                        {
                                            this.slow(1 * 1000);
                                            await tester.Run();
                                            tester.AssertDependencies(new TSGeneratorDependencies());
                                        });
                                });

                            suite(
                                nameof(TSGeneratorExampleDependencies),
                                () =>
                                {
                                    test(
                                        `Checking whether the dependencies are present if a \`${nameof(TSGeneratorComponent.GeneratorExample)}\` is being created…`,
                                        async function()
                                        {
                                            this.slow(1 * 1000);

                                            tester.Generator.Settings[GeneratorSettingKey.Components] = [
                                                TSGeneratorComponent.GeneratorExample
                                            ];

                                            await tester.Run();
                                            await tester.AssertDependencies(new TSGeneratorExampleDependencies());
                                        });

                                    test(
                                        `Checking whether the dependencies are present if \`${nameof(TSGeneratorComponent.SubGeneratorExample)}\`s are being created…`,
                                        async function()
                                        {
                                            this.slow(1 * 1000);

                                            tester.Generator.Settings[GeneratorSettingKey.Components] = [
                                                TSGeneratorComponent.SubGeneratorExample
                                            ];

                                            await tester.Run();
                                            await tester.AssertDependencies(new TSGeneratorExampleDependencies());
                                        });

                                    test(
                                        `Checking whether the dependencies are present if both a \`${nameof(TSGeneratorComponent.GeneratorExample)}\` and \`${nameof(TSGeneratorComponent.SubGeneratorExample)}\`s are being created…`,
                                        async function()
                                        {
                                            this.slow(1 * 1000);

                                            tester.Generator.Settings[GeneratorSettingKey.Components] = [
                                                TSGeneratorComponent.GeneratorExample,
                                                TSGeneratorComponent.SubGeneratorExample
                                            ];

                                            await tester.Run();
                                            await tester.AssertDependencies(new TSGeneratorExampleDependencies());
                                        });

                                    test(
                                        "Checking whether the dependencies are not present if no generator-example is being created…",
                                        async function()
                                        {
                                            this.slow(1 * 1000);
                                            tester.Generator.Settings[GeneratorSettingKey.Components] = [];
                                            await tester.Run();
                                            await tester.AssertDependencies(new TSGeneratorExampleDependencies(), false);
                                        });
                                });
                        });
                });
        });
}
