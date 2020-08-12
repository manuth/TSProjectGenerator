import Assert = require("assert");
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { DebugConfiguration } from "vscode";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { LaunchFileProcessor } from "../../VSCode/LaunchFileProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `LaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function LaunchFileProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "LaunchFileProcessor",
        () =>
        {
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
                    processor = new TestLaunchFileProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedDebugConfig = {
                        name: context.Random.string(9),
                        type: context.Random.string(9),
                        request: context.Random.string(9)
                    };

                    excludedDebugConfig = {
                        name: context.Random.string(10),
                        type: context.Random.string(10),
                        request: context.Random.string(10)
                    };

                    mutatedDebugConfig = {
                        name: context.Random.string(11),
                        type: context.Random.string(11),
                        request: context.Random.string(11)
                    };

                    launchMetadata = {
                        version: "",
                        configurations: [
                            includedDebugConfig,
                            excludedDebugConfig,
                            mutatedDebugConfig
                        ]
                    };

                    newName = context.Random.string(12);
                });

            suite(
                "Process",
                () =>
                {
                    test(
                        "Checking whether debug-configurations are only processed if existent…",
                        async () =>
                        {
                            Assert.strictEqual(
                                (await processor.Process({ version: "", configurations: null })).configurations,
                                null);
                        });
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
