import { ok } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TSProjectSettingsProcessor } from "../../../Project/VSCode/TSProjectSettingsProcessor.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectSettingsProcessor `TSProjectSettingsProcessor<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectSettingsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectSettingsProcessor),
        () =>
        {
            let excludedSettings = [
                "files.associations",
                "mochaExplorer.debuggerConfig",
                "search.exclude",
                "typescript.tsdk",
                "terminal.integrated.cwd"
            ];

            let settings: Record<string, any>;
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suite(
                nameof<TSProjectSettingsProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    suiteSetup(
                        async function()
                        {
                            this.timeout(5 * 60 * 1000);
                            component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                            processor = new TSProjectSettingsProcessor(component);
                            settings = processor.Process(await component.Source.GetLaunchMetadata());
                        });

                    for (let excludedSetting of excludedSettings)
                    {
                        test(
                            `Checking whether the \`${excludedSetting}\` setting is excluded…`,
                            async () =>
                            {
                                ok(!(excludedSetting in settings));
                            });
                    }
                });
        });
}
