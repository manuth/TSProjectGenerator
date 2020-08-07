import Assert = require("assert");
import { resolve } from "path";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "temp-filesystem";
import chdir = require("util.chdir");
import { TSProjectDestinationQuestion } from "../../../Project/Inquiry/TSProjectDestinationQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `TSProjectDestinationQuestion` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectDestinationQuestionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectDestinationQuestion",
        () =>
        {
            let tempDir: TempDirectory;
            let generator: TSProjectGenerator;
            let question: TSProjectDestinationQuestion<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    tempDir = new TempDirectory();
                    generator = await context.Generator;
                    question = new TSProjectDestinationQuestion(generator);
                });

            suiteTeardown(
                () =>
                {
                    tempDir.Dispose();
                });

            test(
                "Checking whether the question default to the generator-destinationpath…",
                async () =>
                {
                    Assert.strictEqual(await question.default(generator.Settings), "./");
                });

            test(
                "Checking whether the filtered value isn't affected by the current working-directory…",
                async () =>
                {
                    let path = ".";
                    let expected = resolve(generator.destinationPath(path));
                    Assert.strictEqual(await question.filter(path, generator.Settings), expected);
                    chdir.pushd(tempDir.FullName);
                    Assert.strictEqual(await question.filter(path, generator.Settings), expected);
                    chdir.popd();
                });
        });
}
