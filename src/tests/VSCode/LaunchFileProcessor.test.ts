import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { DebugConfiguration } from "vscode";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { LaunchFileProcessor } from "../../VSCode/LaunchFileProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `LaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function LaunchFileProcessorTests(context: TestContext<TestGenerator>): void
{
    suite.only(
        "LaunchFileProcessor",
        () =>
        {
            let random: Random;
            let launchMetadata: ILaunchFile;
            let includedDebugConfig: DebugConfiguration;
            let excludedDebugConfig: DebugConfiguration;
            let mutatedDebugConfig: DebugConfiguration;
            let newName: string;
            let processor: LaunchFileProcessor<ITestGeneratorSettings>;

            /**
             * Provides an implementation of the `LaunchFileProcessor`class for testing.
             */
            class TestLaunchFileProcessor extends LaunchFileProcessor<ITestGeneratorSettings>
            {
                /**
                 * @inheritdoc
                 *
                 * @param debugConfig
                 * The debug-configuration to filter.
                 *
                 * @returns
                 * A value indicating whether the debug-configuration should be included.
                 */
                protected async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
                {
                    return debugConfig !== excludedDebugConfig;
                }

                /**
                 * @inheritdoc
                 *
                 * @param debugConfig
                 * The debug-configuration to process.
                 *
                 * @returns
                 * The processed debug-configuration.
                 */
                protected async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
                {
                    if (debugConfig === mutatedDebugConfig)
                    {
                        debugConfig.name = newName;
                    }

                    return debugConfig;
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    processor = new TestLaunchFileProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedDebugConfig = {
                        name: random.string(9),
                        type: random.string(9),
                        request: random.string(9)
                    };

                    excludedDebugConfig = {
                        name: random.string(10),
                        type: random.string(10),
                        request: random.string(10)
                    };

                    mutatedDebugConfig = {
                        name: random.string(11),
                        type: random.string(11),
                        request: random.string(11)
                    };

                    launchMetadata = {
                        version: "",
                        configurations: [
                            includedDebugConfig,
                            excludedDebugConfig,
                            mutatedDebugConfig
                        ]
                    };

                    newName = random.string(12);
                });

            suite(
                "FilterDebugConfig",
                () =>
                {
                    test(
                        "Checking whether debug-configurations can be excluded…",
                        async () =>
                        {
                            Assert.ok((await processor.Process(launchMetadata)).configurations.includes(includedDebugConfig));
                            Assert.ok(!(await processor.Process(launchMetadata)).configurations.includes(excludedDebugConfig));
                        });
                });

            suite(
                "ProcessDebugConfig",
                () =>
                {
                    test(
                        "Checking whether debug-configurations can be mutated…",
                        async () =>
                        {
                            Assert.ok(
                                (await processor.Process(launchMetadata)).configurations.some(
                                    (configuration) => configuration.name === newName));
                        });
                });
        });
}
