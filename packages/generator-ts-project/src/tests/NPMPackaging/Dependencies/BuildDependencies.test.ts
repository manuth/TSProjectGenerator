import { DependencyCollectionTester } from "@manuth/generator-ts-project-test";
import { BuildDependencies } from "../../../NPMPackaging/Dependencies/BuildDependencies";

/**
 * Registers tests for the {@link BuildDependencies `BuildDependencies`} class.
 */
export function BuildDependencyTests(): void
{
    suite(
        nameof(BuildDependencies),
        () =>
        {
            let dependencies: BuildDependencies;
            let tester: DependencyCollectionTester;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    dependencies = new BuildDependencies();
                    tester = new DependencyCollectionTester(dependencies);
                });

            suite(
                nameof(BuildDependencies.constructor),
                () =>
                {
                    test(
                        "Checking whether all required dependencies are present…",
                        async () =>
                        {
                            await tester.AssertDependencyNames(
                                {
                                    devDependencies: [
                                        "@manuth/tsconfig",
                                        "typescript"
                                    ]
                                });
                        });
                });
        });
}
