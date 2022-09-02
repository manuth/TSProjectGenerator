import { deepStrictEqual, notDeepStrictEqual, ok } from "node:assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { SettingsProcessor } from "../../VSCode/SettingsProcessor.js";
import { TestContext } from "../TestContext.js";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent.js";

/**
 * Registers tests for the {@link SettingsProcessor `SettingsProcessor<TSettings, TOptions>`} class.
 */
export function SettingsProcessorTest(): void
{
    suite(
        nameof(SettingsProcessor),
        () =>
        {
            let context = TestContext.Default;
            let includedSetting: string;
            let excludedSetting: string;
            let mutatedSetting: string;
            let newSetting: any;
            let settings: Record<string, any>;
            let processor: SettingsProcessor<IGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the {@link SettingsProcessor `SettingsProcessor<TSettings, TOptions>`} class for testing.
             */
            class TestSettingsProcessor extends SettingsProcessor<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param key
                 * The key of the setting.
                 *
                 * @param value
                 * The value of the setting to filter.
                 *
                 * @returns
                 * A value indicating whether the setting with the specified key should be included.
                 */
                public override async FilterSetting(key: string, value: any): Promise<boolean>
                {
                    return key !== excludedSetting;
                }

                /**
                 * @inheritdoc
                 *
                 * @param key
                 * The key of the setting to process
                 *
                 * @param value
                 * The value of the setting to process.
                 *
                 * @returns
                 * The processed setting.
                 */
                public override async ProcessSetting(key: string, value: any): Promise<any>
                {
                    if (key === mutatedSetting)
                    {
                        return newSetting;
                    }
                    else
                    {
                        return value;
                    }
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    processor = new TestSettingsProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedSetting = context.RandomString;
                    excludedSetting = context.RandomString;
                    mutatedSetting = context.RandomString;
                    newSetting = {
                        ...context.RandomObject,
                        mutated: true
                    };

                    settings = {
                        [includedSetting]: context.RandomObject,
                        [excludedSetting]: context.RandomObject,
                        [mutatedSetting]: context.RandomObject
                    };
                });

            suite(
                nameof<TestSettingsProcessor>((processor) => processor.FilterSetting),
                () =>
                {
                    test(
                        "Checking whether settings can be filtered…",
                        async () =>
                        {
                            ok(excludedSetting in settings);
                            ok(includedSetting in await processor.Process(settings));
                            ok(!(excludedSetting in await processor.Process(settings)));
                        });
                });

            suite(
                nameof<TestSettingsProcessor>((processor) => processor.ProcessSetting),
                () =>
                {
                    test(
                        "Checking whether settings can be pre-processed…",
                        async () =>
                        {
                            notDeepStrictEqual(settings[mutatedSetting], newSetting);
                            deepStrictEqual((await processor.Process(settings))[mutatedSetting], newSetting);
                        });
                });
        });
}
