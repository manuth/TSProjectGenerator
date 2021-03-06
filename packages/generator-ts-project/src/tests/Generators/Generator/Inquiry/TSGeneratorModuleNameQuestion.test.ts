import { notStrictEqual, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TempDirectory } from "@manuth/temp-files";
import { writeJSON } from "fs-extra";
import { TSGeneratorModuleNameQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorModuleNameQuestion";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { TestContext } from "../../../TestContext";

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
            let tempDir: TempDirectory;
            let settings: ITSGeneratorSettings;
            let question: TSGeneratorModuleNameQuestion<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    tempDir = new TempDirectory();

                    settings = {
                        ...(await context.Generator).Settings,
                        [TSProjectSettingKey.Destination]: tempDir.FullName,
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
                            strictEqual(await question.default(settings), "generator-this-is-a-test");
                        });

                    test(
                        "Checking whether names of existing packages are preserved…",
                        async () =>
                        {
                            let npmPackage = new Package(tempDir.MakePath("package.json"), { name: "this-is-a-test" });
                            await writeJSON(npmPackage.FileName, npmPackage.ToJSON());
                            strictEqual(await question.default(settings), npmPackage.Name);
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
                            notStrictEqual(await question.validate("lol", settings), true);
                            strictEqual(await question.validate("generator-lol", settings), true);
                        });

                    test(
                        "Checking whether scoped module-names are only valid if they start with `generator-`…",
                        async () =>
                        {
                            notStrictEqual(await question.validate("@me/lol", settings), true);
                            strictEqual(await question.validate("@me/generator-lol", settings), true);
                        });
                });
        });
}
