import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { ScriptMapping } from "../../../NPMPackaging/Scripts/ScriptMapping.js";
import { TestContext } from "../../TestContext.js";
import { TestScriptTransformer } from "./TestScriptTransformer.js";

/**
 * Registers tests for the {@link ScriptMapping `ScriptMapping<TSettings, TOptions>`} class.
 */
export function ScriptMappingTests(): void
{
    suite(
        nameof(ScriptMapping),
        () =>
        {
            let context = TestContext.Default;
            let npmPackage: Package;
            let scriptMapping: ScriptMapping<IGeneratorSettings, GeneratorOptions>;
            let randomSource: string;
            let randomDestination: string;
            let randomScript: string;

            setup(
                async function()
                {
                    this.timeout(30 * 1000);
                    npmPackage = new Package();
                    randomSource = context.RandomString;
                    randomDestination = context.RandomString;
                    randomScript = context.RandomString;

                    npmPackage.Scripts.Add(randomSource, randomScript);

                    scriptMapping = new ScriptMapping(
                        await context.Generator,
                        npmPackage,
                        {
                            Source: randomSource,
                            Destination: randomDestination
                        });
                });

            suite(
                nameof(ScriptMapping.constructor),
                () =>
                {
                    test(
                        "Checking whether passing a string constructs a script-mapping for copying the specified script…",
                        async () =>
                        {
                            scriptMapping = new ScriptMapping(await context.Generator, npmPackage, randomSource);
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
                });

            suite(
                nameof<ScriptMapping<any, any>>((scriptMapping) => scriptMapping.Processor),
                () =>
                {
                    test(
                        "Checking whether scripts are loaded from the source-package correctly…",
                        async () =>
                        {
                            strictEqual(await scriptMapping.Processor(), randomScript);
                        });

                    test(
                        "Checking whether scripts are not being transformed by default…",
                        async () =>
                        {
                            strictEqual(await scriptMapping.Processor(), randomScript);
                        });

                    test(
                        "Checking whether custom transformers can be passed…",
                        async () =>
                        {
                            let index = context.Random.integer(1, randomScript.length - 1);
                            let transformer: TestScriptTransformer = (script: string): string => script.substring(index);

                            scriptMapping = new ScriptMapping(
                                await context.Generator,
                                npmPackage,
                                {
                                    Source: randomSource,
                                    Destination: randomDestination,
                                    Processor: async (script) => transformer(script)
                                });

                            strictEqual(await scriptMapping.Processor(), transformer(randomScript));
                        });
                });
        });
}
