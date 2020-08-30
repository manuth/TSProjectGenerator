import Assert = require("assert");
import { Generator, GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Package } from "@manuth/package-json-editor";
import { TestContext } from "../../TestContext";
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
            let originalName: Generator["user"]["git"]["name"];
            let originalMail: Generator["user"]["git"]["email"];
            let options: ITestPackageOptions<ITestGeneratorSettings, GeneratorOptions>;
            let fileMapping: TestPackageFileMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestPackageFileMapping<ITestGeneratorSettings, GeneratorOptions>>;

            suiteSetup(
                async () =>
                {
                    let generator = await context.Generator;
                    let randomName = context.RandomString;
                    let randomMail = context.RandomString;

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
                            randomSource = context.RandomString;
                            randomDestination = context.RandomString;
                            randomScript = context.RandomString;
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
                            let index = context.Random.integer(1, randomScript.length - 1);

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
                            let randomLicense = context.RandomString;

                            await tester.WritePackage(
                                {
                                    license: randomLicense
                                });

                            await tester.Run();
                            Assert.strictEqual((await tester.Package).License, randomLicense);
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
