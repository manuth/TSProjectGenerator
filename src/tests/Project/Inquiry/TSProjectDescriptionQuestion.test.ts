import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import { Random } from "random-js";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `TSProjectDescriptionQuestion` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDescriptionQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectDescriptionQuestion",
        () =>
        {
            let random: Random;
            let generator: TSProjectGenerator;
            let question: TSProjectDescriptionQuestion<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    generator = await context.Generator;
                    question = new TSProjectDescriptionQuestion(generator);
                });

            test(
                "Checking whether the description defaults to the contents of the `README` file…",
                async () =>
                {
                    let randomDescription = random.string(30);

                    await writeFile(
                        generator.destinationPath("README.md"),
                        dedent(
                            `
                                # This is a test
                                ${randomDescription}`));

                    Assert.strictEqual(
                        await question.default(
                            {
                                ...generator.Settings,
                                [TSProjectSettingKey.Destination]: generator.destinationPath()
                            }),
                        randomDescription);
                });
        });
}
