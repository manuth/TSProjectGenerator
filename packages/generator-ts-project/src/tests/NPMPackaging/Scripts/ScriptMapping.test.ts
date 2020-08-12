import Assert = require("assert");
import { TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { ScriptMapping } from "../../../NPMPackaging/Scripts/ScriptMapping";
import { TestContext } from "../../TestContext";
import { TestScriptTransformer } from "./TestScriptTransformer";

/**
 * Registers tests for the `ScriptMapping` class.
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
            let scriptMapping: ScriptMapping<ITestGeneratorSettings>;
            let random: Random;
            let randomSource: string;
            let randomDestination: string;
            let randomScript: string;

            suiteSetup(
                () =>
                {
                    random = new Random();
                });

            setup(
                async function()
                {
                    this.timeout(0);
                    randomSource = random.string(10);
                    randomDestination = random.string(10);
                    randomScript = random.string(10);

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
                    Assert.strictEqual(await scriptMapping.Destination, await scriptMapping.Source);
                    Assert.strictEqual(await scriptMapping.Source, randomSource);
                });

            test(
                "Checking whether passing options constructs a proper script-mapping…",
                async () =>
                {
                    Assert.strictEqual(await scriptMapping.Source, randomSource);
                    Assert.strictEqual(await scriptMapping.Destination, randomDestination);
                });

            test(
                "Checking whether sciprts are not being transformed by default…",
                async () =>
                {
                    Assert.strictEqual(await scriptMapping.Process(randomScript), randomScript);
                });

            test(
                "Checking whether custom transformers can be passed…",
                async () =>
                {
                    let index = random.integer(1, randomScript.length - 1);
                    let transformer: TestScriptTransformer = (script: string): string => script.substring(index);

                    scriptMapping = new ScriptMapping(
                        await context.Generator,
                        {
                            Source: randomSource,
                            Destination: randomDestination,
                            Processor: async (script) => transformer(script)
                        });

                    Assert.strictEqual(await scriptMapping.Process(randomScript), transformer(randomScript));
                });
        });
}
