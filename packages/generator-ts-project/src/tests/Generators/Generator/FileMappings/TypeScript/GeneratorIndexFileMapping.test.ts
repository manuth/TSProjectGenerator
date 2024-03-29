import { ok, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Generator, GeneratorConstructor, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { PackageType } from "@manuth/package-json-editor";
import { Context } from "mocha";
import npmWhich from "npm-which";
import { SourceFile } from "ts-morph";
import { GeneratorClassFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorClassFileMapping.js";
import { GeneratorIndexFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorIndexFileMapping.js";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping.js";
import { SettingsInterfaceFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingsInterfaceFileMapping.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link GeneratorIndexFileMapping `GeneratorIndexFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorIndexFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorIndexFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link GeneratorIndexFileMapping `GeneratorIndexFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestGeneratorIndexFileMapping extends GeneratorIndexFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    this.Dispose();
                    return super.Transform(sourceFile);
                }
            }

            let npmPath: string;
            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestGeneratorIndexFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestGeneratorIndexFileMapping>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot, true);
                    fileMapping = new TestGeneratorIndexFileMapping(generator, namingContext);
                    await new FileMappingTester(generator, new GeneratorClassFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingKeyFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingsInterfaceFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new LicenseTypeFileMapping(generator, namingContext)).Run();
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });
                });

            suite(
                nameof<TestGeneratorIndexFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorIndexFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorIndexFileName);
                        });
                });

            suite(
                nameof<TestGeneratorIndexFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    suiteSetup(
                        async function()
                        {
                            await TransformFile(this);
                        });

                    /**
                     * Transforms the file mapping which is under testing.
                     *
                     * @param mochaContext
                     * The mocha context for setting an apropriate timeout.
                     */
                    async function TransformFile(mochaContext: Context): Promise<void>
                    {
                        mochaContext.timeout(1.5 * 60 * 1000);
                        mochaContext.slow(45 * 1000);
                        let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                        await tester.DumpOutput(sourceFile);
                        sourceFile.forget();
                    }

                    /**
                     * Asserts that the specified {@link generatorConstructor `generatorConstructor`} inherits the {@link Generator `Generator<TSettings, TOptions>`} class.
                     *
                     * @param generatorConstructor
                     * The object to check.
                     */
                    function AssertGeneratorConstructor(generatorConstructor: GeneratorConstructor): void
                    {
                        let newGenerator = context.CreateGenerator(generatorConstructor);
                        let classCandidates: any[] = [];

                        for (
                            let candidate = newGenerator.constructor;
                            candidate !== null;
                            candidate = Object.getPrototypeOf(candidate))
                        {
                            classCandidates.push(candidate);
                        }

                        ok(
                            classCandidates.some(
                                (candidate) =>
                                {
                                    return `${candidate}` === Generator.toString();
                                }));
                    }

                    test(
                        `Checking whether the file exports a yeoman-generator if a \`${nameof(PackageType.CommonJS)}\` module is generated…`,
                        async function()
                        {
                            generator.Settings[TSProjectSettingKey.ESModule] = false;
                            await TransformFile(this);
                            AssertGeneratorConstructor(await tester.Require());
                        });

                    test(
                        `Checking whether the file default exports a yeoman-generator if an \`${nameof(PackageType.ESModule)}\` is generated…`,
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            await TransformFile(this);
                            AssertGeneratorConstructor(await tester.ImportDefault());
                        });
                });
        });
}
