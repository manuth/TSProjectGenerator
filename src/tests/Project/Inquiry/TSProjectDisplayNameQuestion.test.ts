import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { TSProjectDisplayNameQuestion } from "../../../Project/Inquiry/TSProjectDisplayNameQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `TSProjectDisplayNameQuestion` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDisplayNameQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectDisplayNameQuestion",
        () =>
        {
            let random: Random;
            let randomName: string;
            let generator: TSProjectGenerator;
            let question: TSProjectDisplayNameQuestion<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    generator = await context.Generator;
                    question = new TSProjectDisplayNameQuestion(generator);
                });

            setup(
                () =>
                {
                    randomName = random.string(10);
                });

            test(
                "Checking whether the name is taken from the destination-directory…",
                async () =>
                {
                    Assert.strictEqual(
                        await question.Default(
                            {
                                ...generator.Settings,
                                [TSProjectSettingKey.Destination]: generator.destinationPath(randomName)
                            }),
                        randomName);
                });
        });
}
