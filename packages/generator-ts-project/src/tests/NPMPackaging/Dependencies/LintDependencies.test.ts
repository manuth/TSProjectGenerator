import { ok } from "assert";
import { DependencyCollectionTester } from "@manuth/generator-ts-project-test";
import { PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { LintDependencies } from "../../../NPMPackaging/Dependencies/LintDependencies";
import { LintEssentials } from "../../../NPMPackaging/Dependencies/LintEssentials";

/**
 * Registers tests for the {@link LintDependencies `LintDependencies`} class.
 */
export function LintDependencyTests(): void
{
    suite(
        nameof(LintDependencies),
        () =>
        {
            let dependencies: LintDependencies;
            let expectedDependencies: PackageDependencyCollectionOptions;
            let tester: DependencyCollectionTester;

            /**
             * Provides an implementation of the {@link LintEssentials `LintEssentials`} class for testing.
             */
            class TestLintEssentials extends LintEssentials
            {
                /**
                 * @inheritdoc
                 */
                public override get DependencyNames(): PackageDependencyCollectionOptions
                {
                    return super.DependencyNames;
                }
            }

            /**
             * Provides an implementation of the {@link LintDependencies `LintDependencies`} class for testing.
             */
            class TestLintDependencies extends LintDependencies
            {
                /**
                 * @inheritdoc
                 */
                public override get DependencyNames(): PackageDependencyCollectionOptions
                {
                    return super.DependencyNames;
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    dependencies = new LintDependencies();

                    expectedDependencies = {
                        devDependencies: [
                            "@manuth/typescript-eslint-plugin"
                        ]
                    };

                    tester = new DependencyCollectionTester(dependencies);
                });

            suite(
                nameof<TestLintDependencies>((dependencies) => dependencies.DependencyNames),
                () =>
                {
                    test(
                        "Checking whether all expected dependency-names are present…",
                        () =>
                        {
                            for (let key of Object.keys(new TestLintEssentials()) as Array<keyof PackageDependencyCollectionOptions>)
                            {
                                for (let dependency of new TestLintEssentials().DependencyNames[key] ?? [])
                                {
                                    ok(new TestLintDependencies().DependencyNames[key].includes(dependency));
                                }
                            }

                            for (let key of Object.keys(expectedDependencies) as Array<keyof PackageDependencyCollectionOptions>)
                            {
                                for (let dependency of expectedDependencies[key] ?? [])
                                {
                                    ok(new TestLintDependencies().DependencyNames[key].includes(dependency));
                                }
                            }
                        });
                });

            suite(
                nameof(LintDependencies.constructor),
                () =>
                {
                    test(
                        "Checking whether all required dependencies are present…",
                        async () =>
                        {
                            await tester.AssertDependencies(new LintEssentials());
                            await tester.AssertDependencyNames(expectedDependencies);
                        });
                });
        });
}
