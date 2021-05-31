import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectExtensionsProcessor } from "../../../Project/VSCode/TSProjectExtensionsProcessor";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectExtensionsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectExtensionsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectExtensionsProcessor",
        () =>
        {
            let excludedExtension = "digitalbrainstem.javascript-ejs-support";
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectExtensionsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(2 * 60 * 1000);
                    component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                    processor = new TSProjectExtensionsProcessor(component);
                });

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
        });
}
