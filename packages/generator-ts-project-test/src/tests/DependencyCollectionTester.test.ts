import { doesNotReject, rejects } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { DependencyCollection, PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { DependencyCollectionTester } from "../DependencyCollectionTester.js";
import { TestConstants } from "./TestConstants.js";

/**
 * Registers tests for the {@link DependencyCollectionTester `DependencyCollectionTester`} class.
 */
export function DependencyCollectionTesterTests(): void
{
    suite(
        nameof(DependencyCollectionTester),
        () =>
        {
            let context = TestContext.Default;
            let tester: DependencyCollectionTester;
            let includedDependency: [string, string];
            let excludedDependency: [string, string];

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                });

            setup(
                async () =>
                {
                    let dependencies = context.Random.sample(TestConstants.Package.AllDependencies.Entries, 2);
                    includedDependency = dependencies[0];
                    excludedDependency = dependencies[1];

                    tester = new DependencyCollectionTester(
                        new DependencyCollection(
                            {
                                dependencies: {
                                    [includedDependency[0]]: includedDependency[1]
                                }
                            }));
                });

            suite(
                nameof<DependencyCollectionTester>((tester) => tester.AssertDependencies),
                () =>
                {
                    let excludedCollection: DependencyCollection;
                    let correctVersionCollection: DependencyCollection;
                    let incorrectVersionCollection: DependencyCollection;

                    setup(
                        () =>
                        {
                            excludedCollection = new DependencyCollection(
                                {
                                    dependencies: {
                                        [excludedDependency[0]]: excludedDependency[1]
                                    }
                                });

                            correctVersionCollection = new DependencyCollection(
                                {
                                    dependencies: {
                                        [includedDependency[0]]: includedDependency[1]
                                    }
                                });

                            incorrectVersionCollection = new DependencyCollection(
                                {
                                    dependencies: {
                                        [includedDependency[0]]: `${includedDependency[1]}1`
                                    }
                                });
                        });

                        test(
                            "Checking whether the existence of dependencies can be asserted correctly…",
                            async function()
                            {
                                this.timeout(4 * 1000);
                                this.slow(2 * 1000);
                                await doesNotReject(() => tester.AssertDependencies(correctVersionCollection));
                                await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true));
                                await rejects(tester.AssertDependencies(excludedCollection));
                                await rejects(tester.AssertDependencies(excludedCollection, true));
                                await doesNotReject(tester.AssertDependencies(excludedCollection, false));
                                await rejects(tester.AssertDependencies(correctVersionCollection, false));
                            });

                        test(
                            "Checking whether the versioning of dependencies can be asserted as expected…",
                            async function()
                            {
                                this.timeout(4 * 1000);
                                this.slow(2 * 1000);
                                await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true, true));
                                await rejects(() => tester.AssertDependencies(incorrectVersionCollection, true, true));
                                await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true, false));
                                await doesNotReject(() => tester.AssertDependencies(incorrectVersionCollection, true, false));
                            });
                });

            suite(
                nameof<DependencyCollectionTester>((tester) => tester.AssertDependencyNames),
                () =>
                {
                    let includedCollection: PackageDependencyCollectionOptions;
                    let excludedCollection: PackageDependencyCollectionOptions;

                    setup(
                        () =>
                        {
                            includedCollection = {
                                dependencies: [
                                    includedDependency[0]
                                ]
                            };

                            excludedCollection = {
                                dependencies: [
                                    excludedDependency[0]
                                ]
                            };
                        });

                    test(
                        "Checking whether asserting the inclusion of dependencies with specified names works correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await doesNotReject(() => tester.AssertDependencyNames(includedCollection));
                            await rejects(() => tester.AssertDependencyNames(excludedCollection));
                            await doesNotReject(() => tester.AssertDependencyNames(includedCollection, true));
                            await rejects(() => tester.AssertDependencyNames(excludedCollection, true));
                            await doesNotReject(() => tester.AssertDependencyNames(excludedCollection, false));
                            await rejects(() => tester.AssertDependencyNames(includedCollection, false));
                        });
                });
        });
}
