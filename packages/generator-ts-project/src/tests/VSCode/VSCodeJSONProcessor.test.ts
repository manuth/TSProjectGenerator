import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { VSCodeJSONProcessor } from "../../VSCode/VSCodeJSONProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the {@link VSCodeJSONProcessor `VSCodeJSONProcessor<TSettings, TOptions, TData>`} class.
 *
 * @param context
 * The test-context.
 */
export function VSCodeJSONProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "VSCodeJSONProcessor",
        () =>
        {
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;
            let processor: VSCodeJSONProcessor<ITestGeneratorSettings, GeneratorOptions, any>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    processor = new VSCodeJSONProcessor(component);
                });

            suite(
                "StripWorkspaceFolder",
                () =>
                {
                    test(
                        "Checking whether a single named workspace is stripped…",
                        () =>
                        {
                            strictEqual(
                                processor.StripWorkspaceFolder(context.NamedWorkspaceFolderDirective),
                                context.WorkspaceFolderDirective);
                        });

                    test(
                        "Checking whether multiple named workspaces are stripped…",
                        () =>
                        {
                            /**
                             * Processes the specified {@link text `text`}.
                             *
                             * @param text
                             * The text to process.
                             *
                             * @returns
                             * A string containing the specified {@link text `text`} at least two times.
                             */
                            function StringProcessor(text: string): string
                            {
                                return `--fileMapping=${text}:${text}`;
                            }

                            strictEqual(
                                processor.StripWorkspaceFolder(StringProcessor(context.NamedWorkspaceFolderDirective)),
                                StringProcessor(context.WorkspaceFolderDirective));
                        });

                    test(
                        "Checking whether normal workspace-directives are left untouched…",
                        () =>
                        {
                            strictEqual(
                                processor.StripWorkspaceFolder(context.NamedWorkspaceFolderDirective),
                                context.WorkspaceFolderDirective);
                        });
                });
        });
}
