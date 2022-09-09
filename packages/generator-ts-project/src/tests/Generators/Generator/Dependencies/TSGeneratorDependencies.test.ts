import { strictEqual } from "node:assert";
import { IDependencyCollectionOptions, Package, PackageType } from "@manuth/package-json-editor";
import { compareVersions } from "compare-versions";
import { TSGeneratorDependencies } from "../../../../generators/generator/Dependencies/TSGeneratorDependencies.js";

/**
 * Registers tests for the {@link TSGeneratorDependencies `TSGeneratorDependencies`} class.
 */
export function TSGeneratorDependencyTests(): void
{
    suite(
        nameof(TSGeneratorDependencies),
        () =>
        {
            /**
             * Provides an implementation of the {@link TSGeneratorDependencies `TSGeneratorDependencies`} class for testing.
             */
            class TestTSGeneratorDependencies extends TSGeneratorDependencies
            {
                /**
                 * Initializes a new instance of the {@link TestTSGeneratorDependencies `TestTSGeneratorDependencies`} class.
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
            let dependencies: TestTSGeneratorDependencies;

            suiteSetup(
                () =>
                {
                    dependencies = new TestTSGeneratorDependencies();
                });

            suite(
                nameof<TestTSGeneratorDependencies>((dependencies) => dependencies.CommonJSOverrides),
                () =>
                {
                    let packageName = "@manuth/extended-yo-generator";

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
