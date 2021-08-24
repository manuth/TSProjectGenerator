import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ArrowFunction, SyntaxKind } from "ts-morph";
import { dirname, normalize, relative } from "upath";
import { GeneratorMainSuiteFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorMainSuiteFileMapping";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../../../Project/Settings/TSProjectSettingKey";
import { TestContext } from "../../../../TestContext";

/**
 * Registers the tests for the {@link GeneratorMainTestFileMapping `GeneratorMainTestFileMapping<TSettings, TOptions>`} class.
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
             * Provides an implementation of the {@link GeneratorMainTestFileMapping `GeneratorMainTestFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestGeneratorMainTestFileMapping extends GeneratorMainSuiteFileMapping<ITSProjectSettings, GeneratorOptions>
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
            let fileMapping: TestGeneratorMainTestFileMapping;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestGeneratorMainTestFileMapping(generator, namingContext);
                });

            suite(
                nameof<TestGeneratorMainTestFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorMainTestFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.MainSuiteFileName);
                        });
                });

            suite(
                nameof<TestGeneratorMainTestFileMapping>((fileMapping) => fileMapping.Context),
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
                nameof<TestGeneratorMainTestFileMapping>((fileMapping) => fileMapping.GetSuiteFunction),
                () =>
                {
                    test(
                        `Checking whether the file providing the generator test-suites is being \`${nameof(require)}\`d…`,
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            let suiteFunction = await fileMapping.GetSuiteFunction();
                            let moduleSpecifier = (await fileMapping.GetSourceObject()).getRelativePathAsModuleSpecifierTo(relative(dirname(fileMapping.Destination), namingContext.GeneratorSuiteFileName));

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
