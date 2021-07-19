import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { Package } from "@manuth/package-json-editor";
import { createSandbox, SinonSandbox } from "sinon";
import type { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { TestContext } from "../../TestContext";
import { TestScriptTransformer } from "../Scripts/TestScriptTransformer";
import { ITestPackageOptions } from "./ITestPackageOptions";
import { TestPackageFileMapping } from "./TestPackageFileMapping";

/**
 * Registers tests for the {@link PackageFileMapping `PackageFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function PackageFileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof<PackageFileMapping<any, any>>(),
        () =>
        {
            let sinon: SinonSandbox;
            let defaultVersion = "0.0.0";
            let options: ITestPackageOptions<ITestGeneratorSettings, GeneratorOptions>;
            let fileMapping: TestPackageFileMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestPackageFileMapping<ITestGeneratorSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sinon = createSandbox();
                    let generator = await context.Generator;
                    let randomName = context.RandomString;
                    let randomMail = context.RandomString;
                    sinon.replace(generator.user.git, "name", () => randomName);
                    sinon.replace(generator.user.git, "email", () => randomMail);

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
                    sinon.restore();
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
                nameof<TestPackageFileMapping<any, any>>((fileMapping) => fileMapping.ScriptMappings),
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
                            this.timeout(8 * 1000);
                            this.slow(4 * 1000);
                            options.ScriptMappings.push(randomSource);
                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).Scripts.Get(randomSource), randomScript);
                        });

                    test(
                        "Checking whether scripts can be renamed…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            options.ScriptMappings.push(
                                {
                                    Source: randomSource,
                                    Destination: randomDestination
                                });

                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).Scripts.Get(randomDestination), randomScript);
                        });

                    test(
                        "Checking whether scripts can be transformed…",
                        async function()
                        {
                            this.timeout(8 * 1000);
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
                            strictEqual((await tester.ParseOutput()).Scripts.Get(randomDestination), transformer(randomScript));
                        });
                });

            suite(
                nameof<TestPackageFileMapping<any, any>>((fileMapping) => fileMapping.Package),
                () =>
                {
                    test(
                        "Checking whether values from existing package-files are preserved…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let randomLicense = context.RandomString;

                            await tester.DumpOutput(
                                new Package(
                                    {
                                        license: randomLicense
                                    }));

                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).License, randomLicense);
                        });

                    test(
                        "Checking whether info about the author are loaded using git…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).Author.Name, tester.Generator.user.git.name());
                            strictEqual((await tester.ParseOutput()).Author.EMail, tester.Generator.user.git.email());
                        });

                    test(
                        `Checking whether the version defaults to \`${defaultVersion}\`…`,
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).Version, defaultVersion);
                        });
                });
        });
}
