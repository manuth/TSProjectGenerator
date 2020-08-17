import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { SettingsProcessor } from "../../VSCode/SettingsProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `SettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function SettingsProcessorTest(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "SettingsProcessor",
        () =>
        {
            let includedSetting: string;
            let excludedSetting: string;
            let mutatedSetting: string;
            let newSetting: any;
            let settings: Record<string, any>;
            let processor: SettingsProcessor<ITestGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the `SettingsProcessor` class for testing.
             */
            class TestSettingsProcessor extends SettingsProcessor<ITestGeneratorSettings, GeneratorOptions>
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
                protected async FilterSetting(key: string, value: any): Promise<boolean>
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
                protected async ProcessSetting(key: string, value: any): Promise<any>
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
                    this.timeout(0);
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
                "FilterSettingKey",
                () =>
                {
                    test(
                        "Checking whether settings can be filtered…",
                        async () =>
                        {
                            Assert.ok(excludedSetting in settings);
                            Assert.ok(includedSetting in await processor.Process(settings));
                            Assert.ok(!(excludedSetting in await processor.Process(settings)));
                        });
                });

            suite(
                "ProcessSetting",
                () =>
                {
                    test(
                        "Checking whether settings can be pre-processed…",
                        async () =>
                        {
                            Assert.notDeepStrictEqual(settings[mutatedSetting], newSetting);
                            Assert.deepStrictEqual((await processor.Process(settings))[mutatedSetting], newSetting);
                        });
                });
        });
}
