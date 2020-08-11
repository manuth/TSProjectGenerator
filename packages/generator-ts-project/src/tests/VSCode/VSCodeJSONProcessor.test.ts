import Assert = require("assert");
import { TestContext, ITestGeneratorSettings, TestGenerator } from "@manuth/extended-yo-generator-test";
import { VSCodeJSONProcessor } from "../../VSCode/VSCodeJSONProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `VSCodeJSONProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function VSCodeJSONProcessorTests(context: TestContext<TestGenerator>): void
{
    suite(
        "VSCodeJSONProcessor",
        () =>
        {
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;
            let processor: VSCodeJSONProcessor<ITestGeneratorSettings, any>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    processor = new VSCodeJSONProcessor(component);
                });

            suite(
                "StripWorkspaceFolder",
                () =>
                {
                    let workspaceFolderDirective = "${workspaceFolder}";
                    let namedWorkspaceFolderDirective = "${workspaceFolder:Test}";

                    test(
                        "Checking whether a single named workspace is stripped…",
                        () =>
                        {
                            Assert.strictEqual(processor.StripWorkspaceFolder(namedWorkspaceFolderDirective), workspaceFolderDirective);
                        });

                    test(
                        "Checking whether multiple named workspaces are stripped…",
                        () =>
                        {
                            /**
                             * Processes the specified `text`.
                             *
                             * @param text
                             * The text to process.
                             *
                             * @returns
                             * A string containing the specified `text` at least two times.
                             */
                            function StringProcessor(text: string): string
                            {
                                return `--filemapping=${text}:${text}`;
                            }

                            Assert.strictEqual(
                                processor.StripWorkspaceFolder(StringProcessor(namedWorkspaceFolderDirective)),
                                StringProcessor(workspaceFolderDirective));
                        });

                    test(
                        "Checking whether normal workspace-directives are left ountouched…",
                        () =>
                        {
                            Assert.strictEqual(processor.StripWorkspaceFolder(workspaceFolderDirective), workspaceFolderDirective);
                        });
                });
        });
}
