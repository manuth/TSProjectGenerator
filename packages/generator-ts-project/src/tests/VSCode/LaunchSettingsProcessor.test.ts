import { ok, strictEqual } from "node:assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DebugConfiguration } from "vscode";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings.js";
import { LaunchSettingsProcessor } from "../../VSCode/LaunchSettingsProcessor.js";
import { TestContext } from "../TestContext.js";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent.js";

/**
 * Registers tests for the {@link LaunchSettingsProcessor `LaunchSettingsProcessor<TSettings, TOptions>`} class.
 */
export function LaunchSettingsProcessorTests(): void
{
    suite(
        nameof(LaunchSettingsProcessor),
        () =>
        {
            let context = TestContext.Default;
            let launchSettings: ILaunchSettings;
            let includedDebugConfig: DebugConfiguration;
            let excludedDebugConfig: DebugConfiguration;
            let mutatedDebugConfig: DebugConfiguration;
            let newName: string;
            let processor: LaunchSettingsProcessor<IGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the {@link LaunchSettingsProcessor `LaunchSettingsProcessor<TSettings, TOptions>`} class for testing.
             */
            class TestLaunchSettingsProcessor extends LaunchSettingsProcessor<IGeneratorSettings, GeneratorOptions>
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
                public override async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
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
                public override async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
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
                    this.timeout(30 * 1000);
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
                nameof<LaunchSettingsProcessor<any, any>>((processor) => processor.Process),
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
                nameof<TestLaunchSettingsProcessor>((processor) => processor.FilterDebugConfig),
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
                nameof<TestLaunchSettingsProcessor>((processor) => processor.ProcessDebugConfig),
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
