import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectSettingsProcessor } from "../../../Project/VSCode/TSProjectSettingsProcessor";
import { TestContext } from "../../TestContext";

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
                "search.exclude",
                "typescript.tsdk",
                "terminal.integrated.cwd"
            ];

            let settings: Record<string, any>;
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                    processor = new TSProjectSettingsProcessor(component);
                    settings = processor.Process(await component.Source.LaunchMetadata);
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
}
