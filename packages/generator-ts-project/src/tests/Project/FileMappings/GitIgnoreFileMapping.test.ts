import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { split } from "eol";
import { readFile } from "fs-extra";
import { GitIgnoreFileMapping } from "../../../Project/FileMappings/GitIgnoreFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { FileMappingTester } from "../../Components/FileMappingTester";

/**
 * Registers tests for the `GitIgnoreFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function GitIgnoreFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "GitIgnoreFileMapping",
        () =>
        {
            let tester: FileMappingTester<TSProjectGenerator, ITSProjectSettings, GitIgnoreFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    tester = new FileMappingTester(await context.Generator, new GitIgnoreFileMapping(await context.Generator));
                    await tester.Run();
                });

            test(
                "Checking whether `.npmignore` files are not excluded…",
                async () =>
                {
                    let npmIgnoreLine = "packages/*/.npmignore";

                    Assert.ok(
                        split((await readFile(await tester.FileMapping.Source)).toString()).some((entry) => entry.includes(npmIgnoreLine)));

                    Assert.ok(!split(await tester.Content).some((entry) => entry.includes(npmIgnoreLine)));
                });
        });
}
