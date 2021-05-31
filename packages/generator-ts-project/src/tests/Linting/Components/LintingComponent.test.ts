import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { LintingComponent } from "../../../Linting/Components/LintingComponent";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `LintingComponent` class.
 *
 * @param context
 * The test-context.
 */
export function LintingComponentTests(context: TestContext<TSProjectGenerator>): void
{
    let component: LintingComponent<ITSProjectSettings, GeneratorOptions>;

    suiteSetup(
        async function()
        {
            this.timeout(2 * 60 * 1000);
            component = new LintingComponent(await context.Generator);
        });

    test(
        "Checking whether all necessary file-mappings are present…",
        async () =>
        {
            for (let fileMappingType of [ESLintRCFileMapping])
            {
                ok(
                    component.FileMappings.some(
                        (fileMapping) =>
                        {
                            return fileMapping instanceof fileMappingType;
                        }));
            }
        });
}
