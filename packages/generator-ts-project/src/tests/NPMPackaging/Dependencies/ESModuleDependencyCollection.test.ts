import { strictEqual } from "node:assert";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { Dictionary, IDependencyCollectionOptions, KeyOfType, Package, PackageDependencyCollectionOptions, PackageType } from "@manuth/package-json-editor";
import { DependencyOverrides } from "../../../NPMPackaging/Dependencies/DependencyOverrides.js";
import { ESModuleDependencyCollection } from "../../../NPMPackaging/Dependencies/ESModuleDependencyCollection.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link ESModuleDependencyCollection `ESModuleDependencyCollection`} class.
 */
export function ESModuleDependencyCollectionTests(): void
{
    suite(
        nameof(ESModuleDependencyCollection),
        () =>
        {
            /**
             * Provides an implementation of the {@link ESModuleDependencyCollection `ESModuleDependencyCollection`} class for testing.
             */
            class TestESModuleDependencyCollection extends ESModuleDependencyCollection
            {
                /**
                 * Initializes a new instance of the {@link TestESModuleDependencyCollection `TestESModuleDependencyCollection`} class.
                 *
                 * @param dependencies
                 * The dependencies to load.
                 */
                public constructor(dependencies: PackageDependencyCollectionOptions)
                {
                    super(dependencies, false);
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
                protected override get ESModule(): boolean
                {
                    return esModule;
                }

                /**
                 * @inheritdoc
                 */
                protected override get ESModuleOverrides(): DependencyOverrides
                {
                    return {
                        [dependencyListName]: {
                            [dependencyName]: esmVersion
                        }
                    };
                }

                /**
                 * @inheritdoc
                 */
                protected override get CommonJSOverrides(): DependencyOverrides
                {
                    return {
                        [dependencyListName]: {
                            [dependencyName]: cjsVersion
                        }
                    };
                }

                /**
                 * @inheritdoc
                 *
                 * @param dependencies
                 * The dependencies to inject the specified {@link overrides `overrides`} into.
                 *
                 * @param overrides
                 * The overrides to inject.
                 */
                public override InjectOverrides(dependencies: Dictionary<string, string>, overrides: Record<string, string>): void
                {
                    super.InjectOverrides(dependencies, overrides);
                }

                /**
                 * @inheritdoc
                 *
                 * @param listName
                 * The name of the list of dependency-names to load.
                 *
                 * @returns
                 * The loaded dependencies.
                 */
                public override LoadDependencies(listName: KeyOfType<IDependencyCollectionOptions, Record<string, string>>): Dictionary<string, string>
                {
                    return super.LoadDependencies(listName);
                }
            }

            let context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>;
            let collection: TestESModuleDependencyCollection;
            let esModule: boolean;
            let dependencyListName: keyof PackageDependencyCollectionOptions;
            let dependencyName: string;
            let neutralDependencyName: string;
            let neutralVersion: string;
            let esmVersion: string;
            let cjsVersion: string;

            suiteSetup(
                () =>
                {
                    context = TestContext.Default;
                    neutralVersion = "^1.0.0";
                    esmVersion = "^2.0.0";
                    cjsVersion = "^3.0.0";
                });

            setup(
                () =>
                {
                    dependencyListName = context.Random.pick<keyof PackageDependencyCollectionOptions>(
                        [
                            "dependencies",
                            "devDependencies",
                            "optionalDependencies",
                            "peerDependencies"
                        ]);

                    [
                        dependencyName,
                        neutralDependencyName
                    ] = context.Random.sample(
                        new TestESModuleDependencyCollection({}).Package.AllDependencies.Keys,
                        2);

                    collection = new TestESModuleDependencyCollection(
                        {
                            [dependencyListName]: [
                                dependencyName,
                                neutralDependencyName
                            ]
                        });
                });

            suite(
                nameof<TestESModuleDependencyCollection>((collection) => collection.InjectOverrides),
                () =>
                {
                    let dependencies: Dictionary<string, string>;
                    let overrides: Record<string, string>;

                    setup(
                        () =>
                        {
                            dependencies = new Dictionary<string, string>();

                            overrides = {
                                [dependencyName]: context.RandomString
                            };

                            dependencies.Add(neutralDependencyName, neutralVersion);
                        });

                    test(
                        "Checking whether existing entries remain…",
                        () =>
                        {
                            collection.InjectOverrides(dependencies, overrides);
                            strictEqual(dependencies.Get(neutralDependencyName), neutralVersion);
                        });

                    test(
                        "Checking whether completely new entries can be injected…",
                        () =>
                        {
                            collection.InjectOverrides(dependencies, overrides);
                            strictEqual(dependencies.Get(dependencyName), overrides[dependencyName]);
                        });

                    test(
                        "Checking whether existing entries can be replaced…",
                        () =>
                        {
                            strictEqual(dependencies.Get(neutralDependencyName), neutralVersion);

                            collection.InjectOverrides(
                                dependencies,
                                {
                                    [neutralDependencyName]: esmVersion
                                });

                            strictEqual(dependencies.Get(neutralDependencyName), esmVersion);
                        });
                });

            suite(
                nameof<TestESModuleDependencyCollection>((collection) => collection.LoadDependencies),
                () =>
                {
                    test(
                        `Checking whether the correct overrides are applied if the collection is intended for an \`${nameof(PackageType.ESModule)}\` project…`,
                        () =>
                        {
                            esModule = true;
                            strictEqual(collection.LoadDependencies(dependencyListName).Get(dependencyName), esmVersion);
                        });

                    test(
                        `Checking whether the correct overrides are applied if the collection is intended for a \`${nameof(PackageType.CommonJS)}\` project…`,
                        () =>
                        {
                            esModule = false;
                            strictEqual(collection.LoadDependencies(dependencyListName).Get(dependencyName), cjsVersion);
                        });
                });
        });
}
