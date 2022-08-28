import { ok } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ExtensionsProcessor } from "../../VSCode/ExtensionsProcessor.js";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings.js";
import { TestContext } from "../TestContext.js";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent.js";

/**
 * Registers tests for the {@link ExtensionsProcessor `ExtensionsProcessor<TSettings, TOptions>`} class.
 */
export function ExtensionsProcessorTests(): void
{
    suite(
        nameof(ExtensionsProcessor),
        () =>
        {
            let context = TestContext.Default;
            let includedExtension: string;
            let excludedExtension: string;
            let processor: ExtensionsProcessor<IGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the {@link ExtensionsProcessor `ExtensionsProcessor<TSettings, TOptions>`} class for testing.
             */
            class TestExtensionsProcessor extends ExtensionsProcessor<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param recommendations
                 * The recommendations to filter.
                 *
                 * @returns
                 * All necessary recommendations.
                 */
                protected override async FilterRecommendations(recommendations: string[]): Promise<string[]>
                {
                    return recommendations.filter((extension) => extension !== excludedExtension);
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    processor = new TestExtensionsProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedExtension = context.RandomString;
                    excludedExtension = context.RandomString;
                });

            suite(
                nameof<ExtensionsProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    test(
                        "Checking whether recommendations can be filtered…",
                        async () =>
                        {
                            ok(!(
                                await processor.Process(
                                    {
                                        recommendations: [
                                            includedExtension,
                                            excludedExtension
                                        ]
                                    })).recommendations.includes(excludedExtension));
                        });

                    test(
                        "Checking whether recommendations are only processed if existent…",
                        async () =>
                        {
                            ok(!(nameof<IExtensionSettings>((e) => e.recommendations) in await processor.Process({})));
                        });
                });
        });
}
