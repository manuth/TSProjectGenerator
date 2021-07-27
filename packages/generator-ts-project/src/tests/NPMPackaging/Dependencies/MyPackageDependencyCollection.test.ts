import { strictEqual } from "assert";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../Core/Constants";
import { MyPackageDependencyCollection } from "../../../NPMPackaging/Dependencies/MyPackageDependencyCollection";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link MyPackageDependencyCollection `MyPackageDependencyCollection`} class.
 */
export function MyPackageDependencyCollectionTests(): void
{
    suite(
        nameof(MyPackageDependencyCollection),
        () =>
        {
            let context = TestContext.Default;

            suite(
                nameof(MyPackageDependencyCollection.constructor),
                () =>
                {
                    test(
                        `Checking whether dependencies can be loaded from the \`${Package.FileName}\` file…`,
                        function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            let dependency = context.Random.pick(Constants.Dependencies.Keys);

                            strictEqual(
                                new MyPackageDependencyCollection(
                                    {
                                        dependencies: [
                                            dependency
                                        ]
                                    }).Dependencies.Get(dependency),
                                Constants.Dependencies.Get(dependency));
                        });
                });
        });
}
