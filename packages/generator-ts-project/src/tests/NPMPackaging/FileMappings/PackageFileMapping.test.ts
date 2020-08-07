import Assert = require("assert");
import { Generator } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Package } from "@manuth/package-json-editor";
import { Random } from "random-js";
import { TestScriptTransformer } from "../Scripts/TestScriptTransformer";
import { ITestPackageOptions } from "./ITestPackageOptions";
import { PackageFileMappingTester } from "./PackageFileMappingTester";
import { TestPackageFileMapping } from "./TestPackageFileMapping";

/**
 * Registers tests for the `PackageFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function PackageFileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "PackageFileMapping",
        () =>
        {
            let random: Random;
            let randomValue: string;
            let originalName: Generator["user"]["git"]["name"];
            let originalMail: Generator["user"]["git"]["email"];
            let options: ITestPackageOptions<ITestGeneratorSettings>;
            let fileMapping: TestPackageFileMapping<ITestGeneratorSettings>;
            let tester: PackageFileMappingTester<TestGenerator, ITestGeneratorSettings, TestPackageFileMapping<ITestGeneratorSettings>>;

            suiteSetup(
                async () =>
                {
                    random = new Random();
                    let generator = await context.Generator;
                    let randomName = random.string(20);
                    let randomMail = random.string(20);

                    originalName = generator.user.git.name;
                    originalMail = generator.user.git.email;
                    generator.user.git.name = () => randomName;
                    generator.user.git.email = () => randomMail;

                    options = {
                        ScriptMappings: null,
                        Template: null
                    };

                    fileMapping = new TestPackageFileMapping(generator, options);
                    tester = new PackageFileMappingTester(generator, fileMapping);
                });

            suiteTeardown(
                async () =>
                {
                    let generator = await context.Generator;
                    generator.user.git.name = originalName;
                    generator.user.git.email = originalMail;
                });

            setup(
                () =>
                {
                    options.ScriptMappings = [];
                    options.Template = new Package();
                    randomValue = random.string(15);
                });

            teardown(
                async () =>
                {
                    await tester.Clean();
                });

            suite(
                "ScriptMappings",
                () =>
                {
                    let randomSource: string;
                    let randomDestination: string;
                    let randomScript: string;

                    setup(
                        async () =>
                        {
                            randomSource = random.string(10);
                            randomDestination = random.string(10);
                            randomScript = random.string(10);
                            options.Template.Scripts.Add(randomSource, randomScript);
                        });

                    test(
                        "Checking whether scripts can be copied…",
                        async function()
                        {
                            this.timeout(0);
                            this.slow(4 * 1000);
                            options.ScriptMappings.push(randomSource);
                            await tester.Run();
                            Assert.strictEqual((await tester.Package).Scripts.Get(randomSource), randomScript);
                        });

                    test(
                        "Checking whether scripts can be renamed…",
                        async function()
                        {
                            this.timeout(0);
                            this.slow(2 * 1000);

                            options.ScriptMappings.push(
                                {
                                    Source: randomSource,
                                    Destination: randomDestination
                                });

                            await tester.Run();
                            Assert.strictEqual((await tester.Package).Scripts.Get(randomDestination), randomScript);
                        });

                    test(
                        "Checking whether scripts can be transformed…",
                        async function()
                        {
                            this.timeout(0);
                            this.slow(4 * 1000);
                            let index = random.integer(1, randomScript.length - 1);

                            let transformer: TestScriptTransformer = (script: string): string => script.substring(index);

                            options.ScriptMappings.push(
                                {
                                    Source: randomSource,
                                    Destination: randomDestination,
                                    Processor: async (script) => transformer(script)
                                });

                            await tester.Run();
                            Assert.strictEqual((await tester.Package).Scripts.Get(randomDestination), transformer(randomScript));
                        });
                });

            suite(
                "Package",
                () =>
                {
                    test(
                        "Checking whether values from existing package-files are preserved…",
                        async function()
                        {
                            this.timeout(0);
                            this.slow(2 * 1000);

                            await tester.WritePackage(
                                {
                                    license: randomValue
                                });

                            await tester.Run();
                            Assert.strictEqual((await tester.Package).License, randomValue);
                        });

                    test(
                        "Checking whether info about the author are loaded using git…",
                        async function()
                        {
                            this.timeout(0);
                            this.slow(2 * 1000);

                            await tester.Run();
                            Assert.strictEqual((await tester.Package).Author.Name, tester.Generator.user.git.name());
                            Assert.strictEqual((await tester.Package).Author.EMail, tester.Generator.user.git.email());
                        });

                    test(
                        "Checking whether the version defaults to `0.0.0`…",
                        async () =>
                        {
                            await tester.Run();
                            Assert.strictEqual((await tester.Package).Version, "0.0.0");
                        });
                });
        });
}
