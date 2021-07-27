import { DependencyCollectionTester } from "@manuth/generator-ts-project-test";
import { LintEssentials } from "../../../NPMPackaging/Dependencies/LintEssentials";

/**
 * Registers tests for the {@link LintEssentials `LintEssentials`} class.
 */
export function LintEssentialTests(): void
{
    suite(
        nameof(LintEssentials),
        () =>
        {
            let dependencies: LintEssentials;
            let tester: DependencyCollectionTester;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    dependencies = new LintEssentials();
                    tester = new DependencyCollectionTester(dependencies);
                });

            suite(
                nameof(LintEssentials.constructor),
                () =>
                {
                    test(
                        "Checking whether all required dependencies are present…",
                        async () =>
                        {
                            await tester.AssertDependencyNames(
                                {
                                    devDependencies: [
                                        "eslint",
                                        "eslint-plugin-deprecation",
                                        "eslint-plugin-import",
                                        "eslint-plugin-jsdoc",
                                        "eslint-plugin-node",
                                        "@manuth/eslint-plugin-typescript",
                                        "@typescript-eslint/eslint-plugin",
                                        "@typescript-eslint/parser",
                                        "@typescript-eslint/eslint-plugin-tslint",
                                        "tslint"
                                    ]
                                });
                        });
                });
        });
}
