import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectExtensionsProcessor } from "../../../Project/VSCode/TSProjectExtensionsProcessor";

/**
 * Registers tests for the `TSProjectExtensionsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectExtensionsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite.only(
        "TSProjectExtensionsProcessor",
        () =>
        {
            let excludedExtension = "digitalbrainstem.javascript-ejs-support";
            let component: TSProjectWorkspaceFolder<ITSProjectSettings>;
            let processor: TSProjectExtensionsProcessor<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectExtensionsProcessor(component);
                });

            test(
                `Checking whether the \`${excludedExtension}\` is excluded…`,
                async () =>
                {
                    Assert.ok(
                        !(await processor.Process(
                            {
                                recommendations: [excludedExtension]
                            })).recommendations.includes(excludedExtension));
                });
        });
}
