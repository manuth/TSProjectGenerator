import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { SettingsProcessor } from "../../VSCode/SettingsProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `SettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function SettingsProcessorTest(context: TestContext<TestGenerator>): void
{
    suite.only(
        "SettingsProcessor",
        () =>
        {
            let random: Random;
            let includedSetting: string;
            let excludedSetting: string;
            let mutatedSetting: string;
            let newSetting: any;
            let settings: Record<string, any>;
            let processor: SettingsProcessor<ITestGeneratorSettings>;

            /**
             * Generates random data.
             *
             * @returns
             * The generated random data.
             */
            function RandomData(): any
            {
                return {
                    random: random.string(10)
                };
            }

            /**
             * Provides an implementation of the `SettingsProcessor` class for testing.
             */
            class TestSettingsProcessor extends SettingsProcessor<ITestGeneratorSettings>
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
                    random = new Random();
                    processor = new TestSettingsProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedSetting = random.string(10);
                    excludedSetting = random.string(10);
                    mutatedSetting = random.string(10);
                    newSetting = {
                        ...RandomData(),
                        mutated: true
                    };

                    settings = {
                        [includedSetting]: RandomData(),
                        [excludedSetting]: RandomData(),
                        [mutatedSetting]: RandomData()
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
