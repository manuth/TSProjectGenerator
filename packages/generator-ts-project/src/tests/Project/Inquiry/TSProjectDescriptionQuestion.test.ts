import { strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import dedent from "dedent";
import fs from "fs-extra";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

const { writeFile } = fs;

/**
 * Registers tests for the {@link TSProjectDescriptionQuestion `TSProjectDescriptionQuestion<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDescriptionQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectDescriptionQuestion),
        () =>
        {
            let readmeFileName = "README.md";
            let generator: TSProjectGenerator;
            let question: TSProjectDescriptionQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    question = new TSProjectDescriptionQuestion(generator);
                });

            suite(
                nameof<TSProjectDescriptionQuestion<any, any>>((question) => question.default),
                () =>
                {
                    test(
                        `Checking whether the description defaults to the contents of the \`${readmeFileName}\` file…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let randomDescription = context.RandomString;

                            await writeFile(
                                generator.destinationPath(readmeFileName),
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
        });
}
