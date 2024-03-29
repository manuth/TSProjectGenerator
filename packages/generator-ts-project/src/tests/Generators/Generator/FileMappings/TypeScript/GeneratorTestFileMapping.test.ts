import { ok, strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { GeneratorTestFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorTestFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { ISuiteContext } from "../../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link GeneratorTestFileMapping `GeneratorTestFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTestFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorTestFileMapping),
        () =>
        {
            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: GeneratorTestFileMapping<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot, true);
                    fileMapping = new GeneratorTestFileMapping(generator, namingContext);
                });

            suite(
                nameof<GeneratorTestFileMapping<ITSProjectSettings, GeneratorOptions>>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<GeneratorTestFileMapping<ITSProjectSettings, GeneratorOptions>>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorTestFileName);
                        });
                });

            suite(
                nameof<GeneratorTestFileMapping<ITSProjectSettings, GeneratorOptions>>((fileMapping) => fileMapping.Context),
                () =>
                {
                    let context: ISuiteContext;

                    setup(
                        async () =>
                        {
                            context = await fileMapping.Context();
                        });

                    test(
                        "Checking whether the name of the suite is set properly…",
                        async () =>
                        {
                            strictEqual(context.SuiteName, namingContext.GeneratorClassName);
                        });

                    test(
                        "Checking whether both a suite function name and a description is set…",
                        () =>
                        {
                            ok(context.SuiteFunction);
                            ok(context.SuiteFunction.Name);
                            ok(context.SuiteFunction.Description);
                        });

                    test(
                        "Checking whether the suite function description contains the generator name…",
                        () =>
                        {
                            ok(context.SuiteFunction.Description.includes(namingContext.GeneratorClassName));
                        });
                });
        });
}
