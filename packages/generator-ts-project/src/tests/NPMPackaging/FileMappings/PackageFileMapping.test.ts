import { ok, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { Package } from "@manuth/package-json-editor";
import { TempFile } from "@manuth/temp-files";
import { remove } from "fs-extra";
import { createSandbox, SinonSandbox } from "sinon";
import type { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ScriptMapping } from "../../../NPMPackaging/Scripts/ScriptMapping";
import { TestContext } from "../../TestContext";
import { TestScriptTransformer } from "../Scripts/TestScriptTransformer";
import { ITestPackageOptions } from "./ITestPackageOptions";
import { TestPackageFileMapping } from "./TestPackageFileMapping";

/**
 * Registers tests for the {@link PackageFileMapping `PackageFileMapping<TSettings, TOptions>`} class.
 */
export function PackageFileMappingTests(): void
{
    suite(
        nameof<PackageFileMapping<any, any>>(),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sinon: SinonSandbox;
            let defaultVersion = "0.0.0";
            let options: ITestPackageOptions<IGeneratorSettings, GeneratorOptions>;
            let fileMapping: TestPackageFileMapping<IGeneratorSettings, GeneratorOptions>;
            let testKeyWord: string;
            let tester: PackageFileMappingTester<TestGenerator, IGeneratorSettings, GeneratorOptions, TestPackageFileMapping<IGeneratorSettings, GeneratorOptions>>;
            let tempFile: TempFile;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    let randomName = context.RandomString;
                    let randomMail = context.RandomString;
                    sinon = createSandbox();
                    generator = await context.Generator;
                    sinon.replace(generator.user.git, "name", () => randomName);
                    sinon.replace(generator.user.git, "email", () => randomMail);
                });

            suiteTeardown(
                async () =>
                {
                    sinon.restore();
                });

            setup(
                () =>
                {
                    options = {
                        ScriptMappings: null,
                        ScriptSource: null
                    };

                    testKeyWord = context.RandomString;
                    options.ScriptMappings = [];
                    options.ScriptSource = new Package();
                    options.Keywords = [testKeyWord];
                    fileMapping = new TestPackageFileMapping(generator, options);
                    tester = new PackageFileMappingTester(generator, fileMapping);
                    tempFile = new TempFile();
                });

            teardown(
                async () =>
                {
                    await tester.Clean();
                    tempFile.Dispose();
                });

            suite(
                nameof<TestPackageFileMapping<any, any>>((fileMapping) => fileMapping.ScriptMappingCollection),
                () =>
                {
                    let randomSource: string;
                    let randomDestination: string;
                    let randomScript: string;
                    let scriptMappingOptions: IScriptMapping<any, any> | string;

                    /**
                     * Gets the script-mapping which belongs to the {@link scriptMappingOptions `scriptMappingOptions`}.
                     *
                     * @returns
                     * The script-mapping which belongs to the {@link scriptMappingOptions `scriptMappingOptions`}.
                     */
                    function GetScriptMapping(): ScriptMapping<any, any>
                    {
                        return fileMapping.ScriptMappingCollection.Items[fileMapping.ScriptMappings.indexOf(scriptMappingOptions)];
                    }

                    /**
                     * Loads the script with the specified {@link scriptName `scriptName`} from the package.
                     *
                     * @param scriptName
                     * The name of the script to load.
                     *
                     * @returns
                     * The content of the script with the specified {@link scriptName `scriptName`}.
                     */
                    async function GetPackageScript(scriptName: string): Promise<string>
                    {
                        return (await tester.ParseOutput()).Scripts.Get(scriptName);
                    }

                    setup(
                        async () =>
                        {
                            randomSource = context.RandomString;
                            randomDestination = context.RandomString;
                            randomScript = context.RandomString;

                            options = {
                                ScriptSource: new Package(),
                                get ScriptMappings(): Array<string | IScriptMapping<any, any>>
                                {
                                    return [
                                        scriptMappingOptions
                                    ];
                                }
                            };

                            options.ScriptSource.Scripts.Add(randomSource, randomScript);

                            scriptMappingOptions = {
                                Destination: null
                            };

                            fileMapping = new TestPackageFileMapping(generator, options);
                            tester = new PackageFileMappingTester(generator, fileMapping);
                        });

                    test(
                        `Checking whether the scripts are loaded from the \`${nameof<TestPackageFileMapping<any, any>>((pkg) => pkg.ScriptSource)}\`…`,
                        async function()
                        {
                            this.timeout(8 * 1000);
                            this.slow(4 * 1000);
                            scriptMappingOptions = randomSource;

                            strictEqual(
                                await GetScriptMapping().Processor(),
                                fileMapping.ScriptSource.Scripts.Get(randomSource));
                        });

                    test(
                        "Checking whether scripts can be copied…",
                        async function()
                        {
                            this.timeout(8 * 1000);
                            this.slow(4 * 1000);
                            scriptMappingOptions = randomSource;
                            await tester.Run();

                            strictEqual(
                                await GetPackageScript(randomSource),
                                randomScript);

                            strictEqual(
                                await GetScriptMapping().Processor(),
                                randomScript);
                        });

                    test(
                        "Checking whether scripts can be renamed…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            scriptMappingOptions = {
                                Source: randomSource,
                                Destination: randomDestination
                            };

                            await tester.Run();
                            strictEqual(await GetPackageScript(randomDestination), randomScript);
                            strictEqual(await GetScriptMapping().Processor(), randomScript);
                        });

                    test(
                        "Checking whether scripts can be transformed…",
                        async function()
                        {
                            this.timeout(8 * 1000);
                            this.slow(4 * 1000);
                            let index = context.Random.integer(1, randomScript.length - 1);
                            let transformer: TestScriptTransformer = (script: string): string => script.substring(index);

                            scriptMappingOptions = {
                                Source: randomSource,
                                Destination: randomDestination,
                                Processor: async (script) => transformer(script)
                            };

                            await tester.Run();
                            strictEqual(await GetScriptMapping().Processor(), transformer(randomScript));
                            strictEqual(await GetPackageScript(randomDestination), transformer(randomScript));
                        });
                });

            suite(
                nameof<TestPackageFileMapping<any, any>>((fileMapping) => fileMapping.GetSourceObject),
                () =>
                {
                    let name: string;

                    setup(
                        () =>
                        {
                            name = context.RandomString;
                        });

                    test(
                        "Checking whether the source-object is loaded from the source-file, if specified and existent…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            options.Source = tempFile.FullName;

                            await tester.DumpSource(
                                new Package(
                                    {
                                        name
                                    }));

                            strictEqual((await fileMapping.GetSourceObject()).Name, name);
                            strictEqual((await fileMapping.GetSourceObject()).FileName, fileMapping.Resolved.Destination);
                        });

                    test(
                        "Checking whether the source-object is loaded from the output-file if no source-file is found…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            options.Source = null;

                            await tester.DumpOutput(
                                new Package(
                                    {
                                        name
                                    }));

                            strictEqual((await fileMapping.GetSourceObject()).Name, name);
                            strictEqual((await fileMapping.GetSourceObject()).FileName, fileMapping.Resolved.Destination);
                        });

                    test(
                        "Checking whether a default package is created if neither a source-file nor an output-file is found…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            options.Source = null;
                            await remove(fileMapping.Resolved.Destination);
                            strictEqual((await fileMapping.GetSourceObject()).Version, defaultVersion);
                            strictEqual((await fileMapping.GetSourceObject()).FileName, fileMapping.Resolved.Destination);
                        });
                });

            suite(
                nameof<TestPackageFileMapping<any, any>>((fileMapping) => fileMapping.GetPackage),
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

                    test(
                        "Checking whether keywords are added to the resulting package…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            ok((await tester.ParseOutput()).Keywords.includes(testKeyWord));
                        });
                });
        });
}
