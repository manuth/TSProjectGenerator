import { doesNotReject, ok } from "node:assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TSProjectExtensionsProcessor } from "../../../Project/VSCode/TSProjectExtensionsProcessor.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectExtensionsProcessor `TSProjectExtensionsProcessor<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectExtensionsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectExtensionsProcessor),
        () =>
        {
            let excludedExtension = "digitalbrainstem.javascript-ejs-support";
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectExtensionsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                    processor = new TSProjectExtensionsProcessor(component);
                });

            suite(
                nameof<TSProjectExtensionsProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    test(
                        `Checking whether the \`${excludedExtension}\` is excluded…`,
                        async () =>
                        {
                            ok(
                                !(await processor.Process(
                                    {
                                        recommendations: [excludedExtension]
                                    })).recommendations.includes(excludedExtension));
                        });

                    test(
                        `Checking whether the extension file can be processed if the \`${nameof(GeneratorSettingKey.Components)}\`-setting is not specified…`,
                        async () =>
                        {
                            delete component.Generator.Settings[GeneratorSettingKey.Components];
                            await doesNotReject(async () => processor.Process(await component.Source.GetExtensionsMetadata()));
                        });
                });
        });
}
