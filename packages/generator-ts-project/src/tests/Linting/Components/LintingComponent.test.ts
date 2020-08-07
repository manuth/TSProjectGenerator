import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { LintingComponent } from "../../../Linting/Components/LintingComponent";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `LintingComponent` class.
 *
 * @param context
 * The test-context.
 */
export function LintingComponentTests(context: TestContext<TSProjectGenerator>): void
{
    let component: LintingComponent<ITSProjectSettings>;

    suiteSetup(
        async function()
        {
            this.timeout(0);
            component = new LintingComponent(await context.Generator);
        });

    test(
        "Checking whether all necessary file-mappings are present…",
        async () =>
        {
            for (let fileMappingType of [ESLintRCFileMapping])
            {
                Assert.ok(
                    (await component.FileMappings).some(
                        (fileMapping) =>
                        {
                            return fileMapping instanceof fileMappingType;
                        }));
            }
        });
}
