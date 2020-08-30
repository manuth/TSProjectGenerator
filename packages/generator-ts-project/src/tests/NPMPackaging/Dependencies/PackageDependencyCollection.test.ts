import Assert = require("assert");
import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { Constants } from "../../../Core/Constants";
import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `PackageDependencyCollection` class.
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
                () =>
                {
                    let dependency = context.Random.pick(Constants.Dependencies.Keys);

                    Assert.strictEqual(
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
