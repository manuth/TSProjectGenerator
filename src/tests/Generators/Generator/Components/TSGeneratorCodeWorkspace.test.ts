import { Component } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorCodeWorkspace } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { TSGeneratorExtensionsMapping } from "../../../../generators/generator/FileMappings/VSCode/TSGeneratorExtensionsMapping";
import { TSGeneratorLaunchFileMapping } from "../../../../generators/generator/FileMappings/VSCode/TSGeneratorLaunchFileMapping";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";

/**
 * Registers tests for the `TSGeneratorCodeWorkspace` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorCodeWorkspaceTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorCodeWorkspace",
        () =>
        {
            let componentOptions: TSGeneratorCodeWorkspace<ITSGeneratorSettings>;
            let component: Component<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    componentOptions = new TSGeneratorCodeWorkspace();
                    component = new Component(await context.Generator, componentOptions);
                });

            test(
                "Checking whether vscode-filemappings for `TSGenerator`s are present…",
                async () =>
                {
                    for (let fileMappingType of [TSGeneratorExtensionsMapping, TSGeneratorLaunchFileMapping])
                    {
                        (await component.FileMappings).some((fileMapping) => fileMapping instanceof fileMappingType);
                    }
                });
        });
}
