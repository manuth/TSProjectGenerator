import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { VSCodeJSONProcessor } from "../../VSCode/VSCodeJSONProcessor.js";
import { TestContext } from "../TestContext.js";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent.js";

/**
 * Registers tests for the {@link VSCodeJSONProcessor `VSCodeJSONProcessor<TSettings, TOptions, TData>`} class.
 */
export function VSCodeJSONProcessorTests(): void
{
    suite(
        nameof(VSCodeJSONProcessor),
        () =>
        {
            let context = TestContext.Default;
            let component: TestCodeWorkspaceComponent<IGeneratorSettings, GeneratorOptions>;
            let processor: VSCodeJSONProcessor<IGeneratorSettings, GeneratorOptions, any>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    processor = new VSCodeJSONProcessor(component);
                });

            suite(
                nameof<VSCodeJSONProcessor<any, any, any>>((processor) => processor.GetWorkspaceFolderDirective),
                () =>
                {
                    test(
                        "Checking whether workspace-folder directives are created correctly…",
                        () =>
                        {
                            strictEqual(processor.GetWorkspaceFolderDirective(), "${workspaceFolder}");
                            strictEqual(processor.GetWorkspaceFolderDirective("Test"), "${workspaceFolder:Test}");
                        });
                });

            suite(
                nameof<VSCodeJSONProcessor<any, any, any>>((processor) => processor.StripWorkspaceFolder),
                () =>
                {
                    test(
                        "Checking whether a single named workspace is stripped…",
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual(
                                processor.StripWorkspaceFolder(context.NamedWorkspaceFolderDirective),
                                context.WorkspaceFolderDirective);
                        });

                    test(
                        "Checking whether multiple named workspaces are stripped…",
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

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
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual(
                                processor.StripWorkspaceFolder(context.NamedWorkspaceFolderDirective),
                                context.WorkspaceFolderDirective);
                        });
                });
        });
}
