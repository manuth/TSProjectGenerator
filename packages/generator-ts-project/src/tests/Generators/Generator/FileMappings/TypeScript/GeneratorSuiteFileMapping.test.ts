import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ArrowFunction, SyntaxKind } from "ts-morph";
import { dirname, relative } from "upath";
import { GeneratorSuiteFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorSuiteFileMapping";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { ISubGenerator } from "../../../../../generators/generator/Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorSettingKey } from "../../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey";
import { TestContext } from "../../../../TestContext";

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
            }

            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestGeneratorSuiteFileMapping;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestGeneratorSuiteFileMapping(generator, namingContext);
                });

            setup(
                () =>
                {
                    generator.Settings[TSProjectSettingKey.Name] = namingContext.GeneratorID;
                    generator.Settings[TSProjectSettingKey.DisplayName] = namingContext.GeneratorDisplayName;

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
                });

            suite(
                nameof<TestGeneratorSuiteFileMapping>((fileMapping) => fileMapping.GetSuiteFunction),
                () =>
                {
                    test(
                        `Checking whether the unit-tests for all sub-generators are \`${nameof(require)}\`d…`,
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);

                            let mainGenerator: ISubGenerator = {
                                [SubGeneratorSettingKey.Name]: generator.Settings[TSProjectSettingKey.Name],
                                [SubGeneratorSettingKey.DisplayName]: generator.Settings[TSProjectSettingKey.DisplayName]
                            };

                            let suiteFunction = await fileMapping.GetSuiteFunction();

                            for (let subGenerator of [mainGenerator, ...generator.Settings[TSGeneratorSettingKey.SubGenerators]])
                            {
                                let subNamingContext = new NamingContext(subGenerator[SubGeneratorSettingKey.Name], subGenerator[SubGeneratorSettingKey.DisplayName], generator.SourceRoot);
                                let moduleSpecifier = (await fileMapping.GetSourceObject()).getRelativePathAsModuleSpecifierTo(relative(dirname(fileMapping.Destination), subNamingContext.GeneratorTestFileName));

                                suiteFunction.getDescendantsOfKind(SyntaxKind.CallExpression).some(
                                    (callExpression) =>
                                    {
                                        return callExpression.getExpression().getText() === nameof(require) &&
                                            callExpression.getArguments()[0]?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue() === moduleSpecifier;
                                    });
                            }
                        });
                });
        });
}
