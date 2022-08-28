import { DependencyCollectionTester } from "@manuth/generator-ts-project-test";
import { LintEssentials } from "../../../NPMPackaging/Dependencies/LintEssentials.js";

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
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            await tester.AssertDependencyNames(
                                {
                                    devDependencies: [
                                        "eslint",
                                        "@manuth/eslint-plugin-typescript"
                                    ]
                                });
                        });
                });
        });
}
