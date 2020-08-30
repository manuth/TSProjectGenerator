import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
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
            let component: TSProjectWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectSettingsProcessor(component);
                });

            test(
                `Checking whether the \`${excludedSetting}\` setting is excluded…`,
                async () =>
                {
                    let settings = processor.Process(await component.Source.LaunchMetadata);
                    Assert.ok(!(excludedSetting in settings));
                });
        });
}
