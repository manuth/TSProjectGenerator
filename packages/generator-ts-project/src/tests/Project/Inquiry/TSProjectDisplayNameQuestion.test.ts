import { strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectDisplayNameQuestion } from "../../../Project/Inquiry/TSProjectDisplayNameQuestion.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectDisplayNameQuestion `TSProjectDisplayNameQuestion<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDisplayNameQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectDisplayNameQuestion),
        () =>
        {
            let randomName: string;
            let generator: TSProjectGenerator;
            let question: TSProjectDisplayNameQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    question = new TSProjectDisplayNameQuestion(generator);
                });

            setup(
                () =>
                {
                    randomName = context.RandomString;
                });

            suite(
                nameof<TSProjectDisplayNameQuestion<any, any>>((question) => question.default),
                () =>
                {
                    test(
                        "Checking whether the name is taken from the destination-directory…",
                        async () =>
                        {
                            strictEqual(
                                await question.Default(
                                    {
                                        ...generator.Settings,
                                        [TSProjectSettingKey.Destination]: generator.destinationPath(randomName)
                                    }),
                                randomName);
                        });
                });
        });
}
