import { doesNotReject, rejects } from "assert";
import { join } from "path";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { DependencyCollection, Package, PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { TempFile } from "@manuth/temp-files";
import rescape = require("@stdlib/utils-escape-regexp-string");
import { PackageFileMappingTester } from "../PackageFileMappingTester";

/**
 * Registers tests for the {@link PackageFileMappingTester `PackageFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
 */
export function PackageFileMappingTesterTests(): void
{
    suite(
        nameof(PackageFileMappingTester),
        () =>
        {
            /**
             * Provides an implementation of the {@link PackageFileMappingTester `PackageFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class for testing.
             */
            class TestPackageFileMappingTester extends PackageFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>
            { }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let outputFile: TempFile;
            let tester: TestPackageFileMappingTester;
            let includedDependency: [string, string];
            let excludedDependency: [string, string];
            let scriptName: string;
            let script: string;

            suiteSetup(
                async function()
                {
                    generator = await context.Generator;
                });

            setup(
                async () =>
                {
                    let dependencies = context.Random.sample(new Package(join(__dirname, "..", "..", Package.FileName)).AllDependencies.Entries, 2);
                    includedDependency = dependencies[0];
                    excludedDependency = dependencies[1];
                    scriptName = context.RandomString;
                    script = context.RandomString;
                    outputFile = new TempFile();

                    tester = new TestPackageFileMappingTester(
                        generator,
                        {
                            Destination: outputFile.FullName
                        });

                    await tester.DumpOutput(
                        new Package(
                            {
                                dependencies: {
                                    [includedDependency[0]]: includedDependency[1]
                                },
                                scripts: {
                                    [scriptName]: script
                                }
                            }));
                });

            teardown(
                () =>
                {
                    outputFile.Dispose();
                });

            suite(
                nameof<TestPackageFileMappingTester>((tester) => tester.AssertDependencies),
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
                        "Checking whether the existence dependencies can be asserted correctly…",
                        async () =>
                        {
                            await doesNotReject(() => tester.AssertDependencies(correctVersionCollection));
                            await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true));

                            await rejects(
                                tester.AssertDependencies(excludedCollection),
                                new RegExp(`package.*doesn't include.*dependency.*${rescape(excludedDependency[0])}`));

                            await rejects(
                                tester.AssertDependencies(excludedCollection, true),
                                new RegExp(`package.*doesn't include.*dependency.*${rescape(excludedDependency[0])}`));

                            await doesNotReject(() => tester.AssertDependencies(excludedCollection, false));

                            await rejects(
                                tester.AssertDependencies(correctVersionCollection, false),
                                new RegExp(`package.*includes.*unwanted.*dependency.*${rescape(includedDependency[0])}`));
                        });

                    test(
                        "Checking whether the versioning of dependencies can be asserted as expected…",
                        async () =>
                        {
                            await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true, true));

                            await rejects(
                                () => tester.AssertDependencies(incorrectVersionCollection, true, true),
                                new RegExp(`package's.*version.*dependency.*${rescape(includedDependency[0])}.*is.*incorrect!.*Expected.*${rescape(incorrectVersionCollection.Dependencies.Get(includedDependency[0]))}.*but got.*${rescape(includedDependency[1])}`));

                            await doesNotReject(() => tester.AssertDependencies(correctVersionCollection, true, false));
                            await doesNotReject(() => tester.AssertDependencies(incorrectVersionCollection, true, false));
                        });
                });

            suite(
                nameof<TestPackageFileMappingTester>((tester) => tester.AssertDependencyNames),
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
                        "Checking whether the inclusion of dependencies with specified names works correctly…",
                        async () =>
                        {
                            await doesNotReject(() => tester.AssertDependencyNames(includedCollection));
                            await rejects(() => tester.AssertDependencyNames(excludedCollection));
                            await doesNotReject(() => tester.AssertDependencyNames(includedCollection, true));
                            await rejects(() => tester.AssertDependencyNames(excludedCollection, true));
                            await doesNotReject(() => tester.AssertDependencyNames(excludedCollection, false));
                            await rejects(() => tester.AssertDependencyNames(includedCollection, false));
                        });
                });

            suite(
                nameof<TestPackageFileMappingTester>((tester) => tester.AssertScript),
                () =>
                {
                    test(
                        "Checking whether the content of a script can be asserted using a predicate…",
                        async () =>
                        {
                            try
                            {
                                await tester.AssertScript(scriptName, (content) => content === script);
                            }
                            catch (exception)
                            {
                                console.log(exception);
                            }

                            await doesNotReject(() => tester.AssertScript(scriptName, (content) => content === script));
                            await rejects(() => tester.AssertScript(scriptName, () => false));
                        });

                    test(
                        "Checking whether the content of a script can be asserted…",
                        async () =>
                        {
                            await doesNotReject(() => tester.AssertScript(scriptName, script));
                            await rejects(() => tester.AssertScript(scriptName, `_${script}`));
                        });
                });
        });
}
