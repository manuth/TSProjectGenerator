import Assert = require("assert");
import { Random } from "random-js";
import { Constants } from "../../../Core/Constants";
import { PackageDependencyCollection } from "../../../NPMPackaging/Dependencies/PackageDependencyCollection";

/**
 * Registers tests for the `PackageDependencyCollection` class.
 */
export function PackageDependencyCollectionTests(): void
{
    suite(
        "PackageDependencyCollection",
        () =>
        {
            let random: Random;

            suiteSetup(
                () =>
                {
                    random = new Random();
                });

            test(
                "Checking whether dependencies can be loaded from the `package.json` file…",
                () =>
                {
                    let dependency = random.pick(Constants.Dependencies.Keys);

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
