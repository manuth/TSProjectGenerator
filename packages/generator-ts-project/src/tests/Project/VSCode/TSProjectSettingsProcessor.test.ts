import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectSettingsProcessor } from "../../../Project/VSCode/TSProjectSettingsProcessor";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectSettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectSettingsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectSettingsProcessor",
        () =>
        {
            let excludedSetting = "files.associations";
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(2 * 60 * 1000);
                    component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                    processor = new TSProjectSettingsProcessor(component);
                });

            test(
                `Checking whether the \`${excludedSetting}\` setting is excluded…`,
                async () =>
                {
                    let settings = processor.Process(await component.Source.LaunchMetadata);
                    ok(!(excludedSetting in settings));
                });
        });
}
