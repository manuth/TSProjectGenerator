import { strictEqual } from "assert";
import { resolve } from "path";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TempDirectory } from "@manuth/temp-files";
import { popd, pushd } from "util.chdir";
import { TSProjectDestinationQuestion } from "../../../Project/Inquiry/TSProjectDestinationQuestion.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectDestinationQuestion `TSProjectDestinationQuestion<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDestinationQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectDestinationQuestion),
        () =>
        {
            let tempDir: TempDirectory;
            let generator: TSProjectGenerator;
            let question: TSProjectDestinationQuestion<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    tempDir = new TempDirectory();
                    generator = await context.Generator;
                    question = new TSProjectDestinationQuestion(generator);
                });

            suite(
                nameof<TSProjectDestinationQuestion<any, any>>((question) => question.default),
                () =>
                {
                    test(
                        "Checking whether the question defaults to the generator's destination-path…",
                        async () =>
                        {
                            strictEqual(await question.default(generator.Settings), "./");
                        });
                });

            suite(
                nameof<TSProjectDestinationQuestion<any, any>>((question) => question.filter),
                () =>
                {
                    test(
                        "Checking whether the filtered value isn't affected by the current working-directory…",
                        async () =>
                        {
                            let path = ".";
                            let expected = resolve(generator.destinationPath(path));
                            strictEqual(await question.filter(path, generator.Settings), expected);
                            pushd(tempDir.FullName);
                            strictEqual(await question.filter(path, generator.Settings), expected);
                            popd();
                        });
                });
        });
}
