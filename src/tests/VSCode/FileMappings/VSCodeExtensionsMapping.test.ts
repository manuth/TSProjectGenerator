import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { JSONFileMappingTester } from "../../Components/JSONFileMappingTester";
import { TestExtensionsMapping } from "./TestExtensionsMapping";

/**
 * Registers tests for the `VSCodeExtensionsMapping` class.VSCodeExtensionsMapping
 *
 * @param context
 * The test-generator.
 */
export function VSCodeExtensionsMappingTests(context: TestContext<TestGenerator>): void
{
    suite(
        "VSCodeExtensionsMapping",
        () =>
        {
            let random: Random;
            let generator: TestGenerator;
            let fileMappingOptions: TestExtensionsMapping<ITestGeneratorSettings>;
            let tester: JSONFileMappingTester<TestGenerator, ITestGeneratorSettings, TestExtensionsMapping<ITestGeneratorSettings>>;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    generator = await context.Generator;
                    fileMappingOptions = new TestExtensionsMapping(new CodeWorkspaceComponent(generator));
                    tester = new JSONFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                () =>
                {
                    randomValue = random.string(10);
                });

            test(
                "Checking whether extensions can be filtered…",
                async () =>
                {
                    let extensionsFile: IExtensionFile;
                    fileMappingOptions.Filter = () => context.CreatePromise([randomValue]);
                    extensionsFile = await tester.Metadata;
                    Assert.ok((extensionsFile.recommendations ?? []).includes(randomValue));
                });
        });
}
