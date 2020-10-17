import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

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
            let generator: TSProjectGenerator;
            let question: TSProjectDescriptionQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    question = new TSProjectDescriptionQuestion(generator);
                });

            test(
                "Checking whether the description defaults to the contents of the `README` file…",
                async () =>
                {
                    let randomDescription = context.RandomString;

                    await writeFile(
                        generator.destinationPath("README.md"),
                        dedent(
                            `
                                # This is a test
                                ${randomDescription}`));

                    strictEqual(
                        await question.default(
                            {
                                ...generator.Settings,
                                [TSProjectSettingKey.Destination]: generator.destinationPath()
                            }),
                        randomDescription);
                });
        });
}
