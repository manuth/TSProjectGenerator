import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectSettingsFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectSettingsFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { JSONFileMappingTester } from "../../../Components/JSONFileMappingTester";

/**
 * Registers tests for the `TSProjectSettingsFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectSettingsFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectSettingsFileMapping",
        () =>
        {
            let associationsSetting = "files.associations";
            let fileMapping: TSProjectSettingsFileMapping<ITSProjectSettings>;
            let tester: JSONFileMappingTester<TSProjectGenerator, ITSProjectSettings, TSProjectSettingsFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSProjectSettingsFileMapping(new TSProjectCodeWorkspaceComponent(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                `Checking whether the \`${associationsSetting}\` setting is excluded…`,
                async () =>
                {
                    let settingsFile: Record<string, unknown> = await tester.Metadata;
                    Assert.ok(!(associationsSetting in settingsFile));
                });
        });
}
