import { strictEqual } from "assert";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { Constants } from "../../../Core/Constants";
import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link PackageDependencyCollection `PackageDependencyCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function PackageDependencyCollectionTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "PackageDependencyCollection",
        () =>
        {
            test(
                "Checking whether dependencies can be loaded from the `package.json` file…",
                function()
                {
                    this.timeout(1 * 1000);
                    this.slow(0.5 * 1000);
                    let dependency = context.Random.pick(Constants.Dependencies.Keys);

                    strictEqual(
                        new PackageDependencyCollection(
                            {
                                dependencies: [
                                    dependency
                                ]
                            }).Dependencies.Get(dependency),
                        Constants.Dependencies.Get(dependency));
                });
        });
}
