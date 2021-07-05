import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ScriptMapping } from "../../../NPMPackaging/Scripts/ScriptMapping";
import { TestContext } from "../../TestContext";
import { TestScriptTransformer } from "./TestScriptTransformer";

/**
 * Registers tests for the {@link ScriptMapping `ScriptMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function ScriptMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "ScriptMapping",
        () =>
        {
            let scriptMapping: ScriptMapping<ITestGeneratorSettings, GeneratorOptions>;
            let randomSource: string;
            let randomDestination: string;
            let randomScript: string;

            setup(
                async function()
                {
                    this.timeout(30 * 1000);
                    randomSource = context.RandomString;
                    randomDestination = context.RandomString;
                    randomScript = context.RandomString;

                    scriptMapping = new ScriptMapping(
                        await context.Generator,
                        {
                            Source: randomSource,
                            Destination: randomDestination
                        });
                });

            test(
                "Checking whether passing a string constructs a script-mapping for copying the specified script…",
                async () =>
                {
                    scriptMapping = new ScriptMapping(await context.Generator, randomSource);
                    strictEqual(scriptMapping.Destination, scriptMapping.Source);
                    strictEqual(scriptMapping.Source, randomSource);
                });

            test(
                "Checking whether passing options constructs a proper script-mapping…",
                async () =>
                {
                    strictEqual(scriptMapping.Source, randomSource);
                    strictEqual(scriptMapping.Destination, randomDestination);
                });

            test(
                "Checking whether sciprts are not being transformed by default…",
                async () =>
                {
                    strictEqual(await scriptMapping.Process(randomScript), randomScript);
                });

            test(
                "Checking whether custom transformers can be passed…",
                async () =>
                {
                    let index = context.Random.integer(1, randomScript.length - 1);
                    let transformer: TestScriptTransformer = (script: string): string => script.substring(index);

                    scriptMapping = new ScriptMapping(
                        await context.Generator,
                        {
                            Source: randomSource,
                            Destination: randomDestination,
                            Processor: async (script) => transformer(script)
                        });

                    strictEqual(await scriptMapping.Process(randomScript), transformer(randomScript));
                });
        });
}
