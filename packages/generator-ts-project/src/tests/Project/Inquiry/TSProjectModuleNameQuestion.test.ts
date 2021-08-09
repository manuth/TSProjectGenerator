import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TempDirectory } from "@manuth/temp-files";
import { writeJSON } from "fs-extra";
import kebabCase = require("lodash.kebabcase");
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TSProjectModuleNameQuestion `TSProjectModuleNameQuestion<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectModuleNameQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectModuleNameQuestion),
        () =>
        {
            let tempDir: TempDirectory;
            let settings: ITSProjectSettings;
            let testName: string;
            let question: TSProjectModuleNameQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    tempDir = new TempDirectory();

                    settings = {
                        ...(await context.Generator).Settings,
                        [TSProjectSettingKey.Destination]: tempDir.FullName
                    };

                    testName = "ThisIsATest";
                    question = new TSProjectModuleNameQuestion(await context.Generator);
                });

            suite(
                nameof<TSProjectModuleNameQuestion<any, any>>((question) => question.default),
                () =>
                {
                    test(
                        "Checking whether the default module-name equals the kebab-cased display-name…",
                        async () =>
                        {
                            strictEqual(
                                await question.default(
                                    {
                                        ...settings,
                                        [TSProjectSettingKey.DisplayName]: testName
                                    }),
                                kebabCase(testName));
                        });

                    test(
                        `Checking whether the package-name is preserved if a \`${Package.FileName}\` already exists…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let npmPackage = new Package(tempDir.MakePath(Package.FileName), { name: "this is a test" });
                            await writeJSON(npmPackage.FileName, npmPackage.ToJSON());
                            strictEqual(await question.default(settings), npmPackage.Name);
                        });
                });
        });
}
