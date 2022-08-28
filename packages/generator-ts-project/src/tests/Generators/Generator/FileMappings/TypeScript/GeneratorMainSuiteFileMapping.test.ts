import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ArrowFunction, SyntaxKind } from "ts-morph";
import upath from "upath";
import { GeneratorMainSuiteFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorMainSuiteFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../../../TestContext.js";

const { dirname, normalize, relative } = upath;

/**
 * Registers the tests for the {@link GeneratorMainSuiteFileMapping `GeneratorMainSuiteFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorMainSuiteFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorMainSuiteFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link GeneratorMainSuiteFileMapping `GeneratorMainSuiteFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestGeneratorMainSuiteFileMapping extends GeneratorMainSuiteFileMapping<ITSProjectSettings, GeneratorOptions>
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
            let fileMapping: TestGeneratorMainSuiteFileMapping;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestGeneratorMainSuiteFileMapping(generator, namingContext);
                });

            suite(
                nameof<TestGeneratorMainSuiteFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorMainSuiteFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.MainSuiteFileName);
                        });
                });

            suite(
                nameof<TestGeneratorMainSuiteFileMapping>((fileMapping) => fileMapping.Context),
                () =>
                {
                    test(
                        "Checking whether the suite's name is set to the chosen display-name of the project…",
                        async () =>
                        {
                            let context = await fileMapping.Context();
                            strictEqual(context.SuiteName, generator.Settings[TSProjectSettingKey.DisplayName]);
                        });
                });

            suite(
                nameof<TestGeneratorMainSuiteFileMapping>((fileMapping) => fileMapping.GetSuiteFunction),
                () =>
                {
                    test(
                        `Checking whether the file providing the generator test-suites is being \`${nameof(require)}\`d…`,
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            let suiteFunction = await fileMapping.GetSuiteFunction();
                            let sourceFile = await fileMapping.GetSourceObject();

                            let moduleSpecifier = sourceFile.getRelativePathAsModuleSpecifierTo(
                                relative(dirname(fileMapping.Destination), namingContext.GeneratorSuiteFileName));

                            sourceFile.forget();

                            ok(
                                suiteFunction.getDescendantsOfKind(SyntaxKind.CallExpression).some(
                                    (callExpression) =>
                                    {
                                        return callExpression.getExpression().getText() === nameof(require) &&
                                            (
                                                normalize(callExpression.getArguments()[0]?.asKind(SyntaxKind.StringLiteral).getLiteralValue()) ===
                                                normalize(moduleSpecifier));
                                    }));
                        });
                });
        });
}
