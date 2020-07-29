import Assert = require("assert");
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorDependencies } from "../../../../../generators/generator/Dependencies/TSGeneratorDependencies";
import { TSGeneratorExampleDependencies } from "../../../../../generators/generator/Dependencies/TSGeneratorExampleDependencies";
import { TSGeneratorPackageFileMapping } from "../../../../../generators/generator/FileMappings/NPMPackaging/TSGeneratorPackageFileMapping";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { PackageFileMappingTester } from "../../../../NPMPackaging/FileMappings/PackageFileMappingTester";

/**
 * Registers tests for the `TSGeneratorPackageFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorPackageFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    let yeomanKeyword = "yeoman-generator";

    suite(
        "TSGeneratorPackageFileMapping",
        () =>
        {
            let fileMappingOptions: TSGeneratorPackageFileMapping<ITSGeneratorSettings>;
            let tester: PackageFileMappingTester<TSGeneratorGenerator, ITSGeneratorSettings, TSGeneratorPackageFileMapping<ITSGeneratorSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMappingOptions = new TSGeneratorPackageFileMapping(await context.Generator);
                    tester = new PackageFileMappingTester(await context.Generator, fileMappingOptions);
                });

            teardown(
                async () =>
                {
                    await tester.Clean();
                });

            suite(
                "Keywords",
                () =>
                {
                    test(
                        `Checking whether the \`${yeomanKeyword}\`-keyword is added if it doesn't exist…`,
                        async function()
                        {
                            this.slow(1 * 1000);

                            await tester.WritePackage(
                                {
                                    keywords: []
                                });

                            await tester.Run();
                            Assert.ok((await tester.Package).Keywords.includes(yeomanKeyword));
                        });

                    test(
                        `Checking whether the \`${yeomanKeyword}\`-keyword is not added if it already exists…`,
                        async function()
                        {
                            this.slow(1 * 1000);

                            await tester.WritePackage(
                                {
                                    keywords: [
                                        yeomanKeyword
                                    ]
                                });

                            await tester.Run();

                            Assert.strictEqual(
                                (await tester.Package).Keywords.filter(
                                    (keyword) =>
                                    {
                                        return keyword === yeomanKeyword;
                                    }).length,
                                1);
                        });
                });

            suite(
                "Dependencies",
                () =>
                {
                    suite(
                        "TSGeneratorDependencies",
                        () =>
                        {
                            test(
                                "Checking whether common dependencies for `TSGenerator`s are present…",
                                async function()
                                {
                                    this.slow(1 * 1000);
                                    await tester.Run();
                                    tester.AssertDependencies(new TSGeneratorDependencies());
                                });
                        });

                    suite(
                        "TSGeneratorExampleDependencies",
                        () =>
                        {
                            test(
                                "Checking whether the dependencies are present if a `GeneratorExample` is being created…",
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
                                "Checking whether the dependencies are present if `SubGeneratorExample`s are being created…",
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
                                "Checking whether the dependencies are present if both a `GeneratorExample` and `SubGeneratorExample`s are being created…",
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
}
