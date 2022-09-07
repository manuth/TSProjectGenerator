import { strictEqual } from "node:assert";
import { IDependencyCollectionOptions, Package, PackageType } from "@manuth/package-json-editor";
import { compareVersions } from "compare-versions";
import { TSGeneratorExampleDependencies } from "../../../../generators/generator/Dependencies/TSGeneratorExampleDependencies.js";

/**
 * Registers tests for the {@link TSGeneratorExampleDependencies `TSGeneratorExampleDependencies`} class.
 */
export function TSGeneratorExampleDependencyTests(): void
{
    suite(
        nameof(TSGeneratorExampleDependencies),
        () =>
        {
            /**
             * Provides an implementation of the {@link TSGeneratorExampleDependencies `TSGeneratorExampleDependencies`} class for testing.
             */
            class TestTSGeneratorExampleDependencies extends TSGeneratorExampleDependencies
            {
                /**
                 * Initializes a new instance of the {@link TestTSGeneratorExampleDependencies `TestTSGeneratorExampleDependencies`} class.
                 */
                public constructor()
                {
                    super(false);
                }

                /**
                 * @inheritdoc
                 */
                protected override get ESModule(): boolean
                {
                    return esModule;
                }

                /**
                 * @inheritdoc
                 */
                public override get Package(): Package
                {
                    return super.Package;
                }

                /**
                 * @inheritdoc
                 */
                public override get CommonJSOverrides(): IDependencyCollectionOptions
                {
                    return super.CommonJSOverrides;
                }
            }

            let esModule: boolean;
            let dependencies: TestTSGeneratorExampleDependencies;

            suiteSetup(
                () =>
                {
                    dependencies = new TestTSGeneratorExampleDependencies();
                });

            suite(
                nameof<TestTSGeneratorExampleDependencies>((dependencies) => dependencies.CommonJSOverrides),
                () =>
                {
                    let packageName = "chalk";

                    test(
                        `Checking whether a lower version of the \`${packageName}\` package is installed for \`${nameof(PackageType.CommonJS)}\` projects…`,
                        () =>
                        {
                            esModule = false;

                            strictEqual(
                                compareVersions(
                                    dependencies.CommonJSOverrides.dependencies[packageName],
                                    dependencies.Package.AllDependencies.Get(packageName)),
                                -1);
                        });

                    test(
                        `Checking whether no override of the \`${packageName}\` package is applied for \`${nameof(PackageType.ESModule)}\` projects…`,
                        () =>
                        {
                            esModule = true;

                            strictEqual(
                                dependencies.AllDependencies.Get(packageName),
                                dependencies.Package.AllDependencies.Get(packageName));
                        });
                });
        });
}
