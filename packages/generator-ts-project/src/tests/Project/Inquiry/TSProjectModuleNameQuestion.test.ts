import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import kebabCase = require("lodash.kebabcase");
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectModuleNameQuestion` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectModuleNameQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectModuleNameQuestion",
        () =>
        {
            let testName: string;
            let generator: TSProjectGenerator;
            let question: TSProjectModuleNameQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    testName = "ThisIsATest";
                    question = new TSProjectModuleNameQuestion(await context.Generator);
                });

            test(
                "Checking whether the default module-name equals the kebab-cased display-name…",
                async () =>
                {
                    strictEqual(
                        await question.default(
                            {
                                ...generator.Settings,
                                [TSProjectSettingKey.DisplayName]: testName
                            }),
                        kebabCase(testName));
                });
        });
}
