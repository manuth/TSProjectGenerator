import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { DebugConfiguration } from "vscode";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { LaunchSettingsProcessor } from "../../VSCode/LaunchSettingsProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `LaunchSettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function LaunchSettingsProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "LaunchSettingsProcessor",
        () =>
        {
            let launchSettings: ILaunchSettings;
            let includedDebugConfig: DebugConfiguration;
            let excludedDebugConfig: DebugConfiguration;
            let mutatedDebugConfig: DebugConfiguration;
            let newName: string;
            let processor: LaunchSettingsProcessor<ITestGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the `LaunchSettingsProcessor`class for testing.
             */
            class TestLaunchSettingsProcessor extends LaunchSettingsProcessor<ITestGeneratorSettings, GeneratorOptions>
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
                protected override async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
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
                protected override async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
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
                    this.timeout(10 * 1000);
                    processor = new TestLaunchSettingsProcessor(new TestCodeWorkspaceComponent(await context.Generator));
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

                    launchSettings = {
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
                            strictEqual(
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
                            ok((await processor.Process(launchSettings)).configurations.includes(includedDebugConfig));
                            ok(!(await processor.Process(launchSettings)).configurations.includes(excludedDebugConfig));
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
                            ok(
                                (await processor.Process(launchSettings)).configurations.some(
                                    (configuration) => configuration.name === newName));
                        });
                });
        });
}
