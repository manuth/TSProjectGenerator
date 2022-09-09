import { notStrictEqual, strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TempDirectory } from "@manuth/temp-files";
import fs from "fs-extra";
import { TSGeneratorModuleNameQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorModuleNameQuestion.js";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../../TestContext.js";

const { writeJSON } = fs;

/**
 * Registers tests for the {@link TSGeneratorModuleNameQuestion `TSGeneratorModuleNameQuestion<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorModuleNameQuestionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorModuleNameQuestion),
        () =>
        {
            let tempDir: TempDirectory;
            let settings: ITSGeneratorSettings;
            let prefix = "generator-";
            let expectedID: string;
            let question: TSGeneratorModuleNameQuestion<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    tempDir = new TempDirectory();

                    settings = {
                        ...(await context.Generator).Settings,
                        [TSProjectSettingKey.Destination]: tempDir.FullName,
                        [TSProjectSettingKey.DisplayName]: "ThisIsATestGenerator"
                    };

                    expectedID = `${prefix}this-is-a-test`;
                    question = new TSGeneratorModuleNameQuestion(await context.Generator);
                });

            suite(
                nameof<TSGeneratorModuleNameQuestion<any, any>>((question) => question.default),
                () =>
                {
                    test(
                        "Checking whether the default value is applied correctly…",
                        async () =>
                        {
                            strictEqual(await question.default(settings), expectedID);
                        });

                    test(
                        "Checking whether names of existing packages are preserved…",
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            let npmPackage = new Package(tempDir.MakePath(Package.FileName), { name: "this-is-a-test" });
                            await writeJSON(npmPackage.FileName, npmPackage.ToJSON());
                            strictEqual(await question.default(settings), npmPackage.Name);
                        });
                });

            suite(
                nameof<TSGeneratorModuleNameQuestion<any, any>>((question) => question.validate),
                () =>
                {
                    test(
                        `Checking whether module-names are only valid if they start with \`${prefix}\`…`,
                        async () =>
                        {
                            notStrictEqual(await question.validate("lol", settings), true);
                            strictEqual(await question.validate("generator-lol", settings), true);
                        });

                    test(
                        `Checking whether scoped module-names are only valid if they start with \`${prefix}\`…`,
                        async () =>
                        {
                            notStrictEqual(await question.validate("@me/lol", settings), true);
                            strictEqual(await question.validate("@me/generator-lol", settings), true);
                        });
                });
        });
}
