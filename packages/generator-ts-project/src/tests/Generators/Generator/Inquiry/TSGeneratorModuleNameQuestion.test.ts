import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { TSGeneratorModuleNameQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorModuleNameQuestion";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";

/**
 * Registers tests for the `TSGeneratorModuleNameQuestion` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorModuleNameQuestionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorModuleNameQuestion",
        () =>
        {
            let settings: ITSGeneratorSettings;
            let question: TSGeneratorModuleNameQuestion<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);

                    settings = {
                        ...(await context.Generator).Settings,
                        [TSProjectSettingKey.DisplayName]: "ThisIsATestGenerator"
                    };

                    question = new TSGeneratorModuleNameQuestion(await context.Generator);
                });

            suite(
                "default",
                () =>
                {
                    test(
                        "Checking whether the default value is applied correctly…",
                        async () =>
                        {
                            Assert.strictEqual(await question.default(settings), "generator-this-is-a-test");
                        });
                });

            suite(
                "validate",
                () =>
                {
                    test(
                        "Checking whether module-names are only valid if they start with `generator-`…",
                        async () =>
                        {
                            Assert.notStrictEqual(await question.validate("lol", settings), true);
                            Assert.strictEqual(await question.validate("generator-lol", settings), true);
                        });

                    test(
                        "Checking whether scoped module-names are only valid if they start with `generator-`…",
                        async () =>
                        {
                            Assert.notStrictEqual(await question.validate("@me/lol", settings), true);
                            Assert.strictEqual(await question.validate("@me/generator-lol", settings), true);
                        });
                });
        });
}
