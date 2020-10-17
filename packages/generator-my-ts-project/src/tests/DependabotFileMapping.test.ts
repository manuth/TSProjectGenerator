import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "@manuth/generator-ts-project";
import { Document } from "yaml";
import { DependabotFileMapping } from "../DependabotFileMapping";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";

/**
 * Registers tests for the `DependabotFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function DependabotFileMappingTests(context: TestContext<MyTSModuleGenerator>): void
{
    suite(
        "DependabotFileMapping",
        () =>
        {
            let updateKey: string;
            let directoryKey: string;
            let fileMappingOptions: DependabotFileMapping<ITSProjectSettings, GeneratorOptions>;
            let documents: Document.Parsed[];

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    updateKey = "updates";
                    directoryKey = "directory";
                    fileMappingOptions = new DependabotFileMapping(await context.Generator);
                });

            setup(
                async () =>
                {
                    documents = await fileMappingOptions.Transform(await fileMappingOptions.Metadata);
                });

            test(
                "Checking whether only one document is present inside the file…",
                () =>
                {
                    strictEqual(documents.length, 1);
                });

            test(
                "Checking whether only one dependabot-configuration is present…",
                () =>
                {
                    strictEqual(documents[0].get(updateKey).toJSON().length, 1);
                });

            test(
                "Checking whether the dependabot-configuration directory points to the root of the project…",
                () =>
                {
                    strictEqual(documents[0].getIn([updateKey, 0, directoryKey]), "/");
                });
        });
}
