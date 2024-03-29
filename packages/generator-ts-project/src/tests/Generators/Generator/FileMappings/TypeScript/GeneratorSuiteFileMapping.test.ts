import { ok, strictEqual } from "node:assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { ArrowFunction, SourceFile, SyntaxKind } from "ts-morph";
import { GeneratorName } from "../../../../../Core/GeneratorName.js";
import { GeneratorSuiteFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorSuiteFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { ISubGenerator } from "../../../../../generators/generator/Settings/ISubGenerator.js";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../../../../../generators/generator/Settings/SubGeneratorSettingKey.js";
import { TSGeneratorComponent } from "../../../../../generators/generator/Settings/TSGeneratorComponent.js";
import { TSGeneratorSettingKey } from "../../../../../generators/generator/Settings/TSGeneratorSettingKey.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link GeneratorSuiteFileMapping `GeneratorSuiteFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorSuiteFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorSuiteFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link GeneratorSuiteFileMapping `GeneratorSuiteFileMapping<TSettings, TOptions>`} for testing.
             */
            class TestGeneratorSuiteFileMapping extends GeneratorSuiteFileMapping<ITSGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The function for registering the suite.
                 */
                public override async GetSuiteFunction(): Promise<ArrowFunction>
                {
                    return super.GetSuiteFunction();
                }

                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    return super.Transform(sourceFile);
                }
            }

            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestGeneratorSuiteFileMapping;

            /**
             * Gets all generators specified in the settings.
             *
             * @returns
             * All generators specified in the settings.
             */
            function GetGenerators(): ISubGenerator[]
            {
                return [
                    {
                        [SubGeneratorSettingKey.Name]: GeneratorName.Main,
                        [SubGeneratorSettingKey.DisplayName]: generator.Settings[TSProjectSettingKey.DisplayName]
                    },
                    ...generator.Settings[TSGeneratorSettingKey.SubGenerators]
                ];
            }

            /**
             * Gets the {@link NamingContext `NamingContext`} for the specified {@link generatorSettings `generatorSettings`}.
             *
             * @param generatorSettings
             * The generator settings to get the {@link NamingContext `NamingContext`} for.
             *
             * @returns
             * The {@link NamingContext `NamingContext`} for the specified {@link generatorSettings `generatorSettings`}.
             */
            function GetNamingContext(generatorSettings: ISubGenerator): NamingContext
            {
                return new NamingContext(
                    generatorSettings[SubGeneratorSettingKey.Name],
                    generatorSettings[SubGeneratorSettingKey.DisplayName],
                    generator.SourceRoot,
                    generator.Settings[TSProjectSettingKey.ESModule]);
            }

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot, true);
                    fileMapping = new TestGeneratorSuiteFileMapping(generator, namingContext);
                });

            setup(
                () =>
                {
                    generator.Settings[TSProjectSettingKey.Name] = namingContext.GeneratorID;
                    generator.Settings[TSProjectSettingKey.DisplayName] = namingContext.GeneratorDisplayName;

                    generator.Settings[GeneratorSettingKey.Components].push(
                        TSGeneratorComponent.GeneratorExample,
                        TSGeneratorComponent.SubGeneratorExample);

                    generator.Settings[TSGeneratorSettingKey.SubGenerators] = [
                        {
                            [SubGeneratorSettingKey.Name]: "test1",
                            [SubGeneratorSettingKey.DisplayName]: "Test 1"
                        },
                        {
                            [SubGeneratorSettingKey.Name]: "test2",
                            [SubGeneratorSettingKey.DisplayName]: "Test 2"
                        }
                    ];
                });

            suite(
                nameof<TestGeneratorSuiteFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorSuiteFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorSuiteFileName);
                        });
                });

            suite(
                nameof<TestGeneratorSuiteFileMapping>((fileMapping) => fileMapping.Context),
                () =>
                {
                    test(
                        "Checking whether the suite's name is set properly…",
                        async () =>
                        {
                            let context = await fileMapping.Context();
                            strictEqual(context.SuiteName, "Generators");
                        });

                    test(
                        "Checking whether a function name and a description is set…",
                        async () =>
                        {
                            let context = await fileMapping.Context();
                            ok(context.SuiteFunction);
                            ok(context.SuiteFunction.Name);
                            ok(context.SuiteFunction.Description);
                        });
                });

            suite(
                nameof<TestGeneratorSuiteFileMapping>((fileMapping) => fileMapping.GetSuiteFunction),
                () =>
                {
                    test(
                        "Checking whether the unit-tests for all sub-generators are executed…",
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            let suiteFunction = await fileMapping.GetSuiteFunction();

                            for (let subGenerator of GetGenerators())
                            {
                                let subNamingContext = GetNamingContext(subGenerator);

                                ok(
                                    suiteFunction.getDescendantsOfKind(SyntaxKind.CallExpression).some(
                                        (callExpression) =>
                                        {
                                            return callExpression.getExpression().getText() === subNamingContext.GeneratorTestFunctionName;
                                        }));
                            }
                        });
                });

            suite(
                nameof<TestGeneratorSuiteFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    test(
                        "Checking whether all generator unit tests are imported properly…",
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());

                            for (let generatorSettings of GetGenerators())
                            {
                                let namingContext = GetNamingContext(generatorSettings);

                                ok(
                                    sourceFile.getImportDeclarations().some(
                                        (importDeclaration) =>
                                        {
                                            return importDeclaration.getNamedImports().some(
                                                    (importSpecifier) =>
                                                    {
                                                        return importSpecifier.getName() === namingContext.GeneratorTestFunctionName;
                                                    });
                                        }));
                            }
                        });
                });
        });
}
