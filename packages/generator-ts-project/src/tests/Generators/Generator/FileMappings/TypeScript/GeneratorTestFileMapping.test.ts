import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratorTestFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorTestFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
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
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new GeneratorTestFileMapping(generator, namingContext);
                });

            suite(
                nameof<GeneratorTestFileMapping<IGeneratorSettings, GeneratorOptions>>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<GeneratorTestFileMapping<IGeneratorSettings, GeneratorOptions>>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorTestFileName);
                        });
                });

            suite(
                nameof<GeneratorTestFileMapping<IGeneratorSettings, GeneratorOptions>>((fileMapping) => fileMapping.Context),
                () =>
                {
                    test(
                        "Checking whether the name of the suite is set properly…",
                        async () =>
                        {
                            strictEqual((await fileMapping.Context()).SuiteName, namingContext.GeneratorClassName);
                        });
                });
        });
}
