import { ok } from "assert";
import { DependencyCollectionTester } from "@manuth/generator-ts-project-test";
import { PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { BuildDependencies } from "../../../NPMPackaging/Dependencies/BuildDependencies";
import { CommonDependencies } from "../../../NPMPackaging/Dependencies/CommonDependencies";

/**
 * Registers tests for the {@link CommonDependencies `CommonDependencies`} class.
 */
export function CommonDependencyTests(): void
{
    suite(
        nameof(CommonDependencies),
        () =>
        {
            let dependencies: CommonDependencies;
            let expectedDependencies: PackageDependencyCollectionOptions;
            let tester: DependencyCollectionTester;

            /**
             * Provides an implementation of the {@link BuildDependencies `BuildDependencies`} class for testing.
             */
            class TestBuildDependencies extends BuildDependencies
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
             * Provides an implementation of the {@link CommonDependencies `CommonDependencies`} class for testing.
             */
            class TestCommonDependencies extends CommonDependencies
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
                    dependencies = new CommonDependencies();

                    expectedDependencies = {
                        devDependencies: [
                            "@types/mocha",
                            "@types/node",
                            "mocha",
                            "rimraf",
                            "source-map-support"
                        ]
                    };

                    tester = new DependencyCollectionTester(dependencies);
                });

            suite(
                nameof<TestCommonDependencies>((dependencies) => dependencies.DependencyNames),
                () =>
                {
                    test(
                        "Checking whether all expected dependency-names are present…",
                        () =>
                        {
                            for (let key of Object.keys(new TestBuildDependencies().DependencyNames) as Array<keyof PackageDependencyCollectionOptions>)
                            {
                                for (let dependency of new TestBuildDependencies().DependencyNames[key] ?? [])
                                {
                                    ok(new TestCommonDependencies().DependencyNames[key].includes(dependency));
                                }
                            }

                            for (let key of Object.keys(expectedDependencies) as Array<keyof PackageDependencyCollectionOptions>)
                            {
                                for (let dependency of expectedDependencies[key] ?? [])
                                {
                                    ok(new TestCommonDependencies().DependencyNames[key].includes(dependency));
                                }
                            }
                        });
                });

            suite(
                nameof(CommonDependencies.constructor),
                () =>
                {
                    test(
                        "Checking whether all required dependencies are present…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertDependencies(new BuildDependencies());
                            await tester.AssertDependencyNames(expectedDependencies);
                        });
                });
        });
}
