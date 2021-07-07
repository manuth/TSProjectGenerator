import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { LintingComponent } from "../../../Linting/Components/LintingComponent";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link LintingComponent `LintingComponent<TSettings, TOptions>`} class.
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
            this.timeout(5 * 60 * 1000);
            component = new LintingComponent(await context.Generator);
        });

    suite(
        nameof(LintingComponent),
        () =>
        {
            suite(
                nameof<LintingComponent<any, any>>((component) => component.FileMappings),
                () =>
                {
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
                });
        });
}
