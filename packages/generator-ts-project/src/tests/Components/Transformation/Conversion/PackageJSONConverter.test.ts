import { deepStrictEqual, doesNotThrow, ok, strictEqual } from "assert";
import { Package } from "@manuth/package-json-editor";
import { parse, stringify } from "comment-json";
import { PackageJSONConverter } from "../../../../Components/Transformation/Conversion/PackageJSONConverter.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link PackageJSONConverter `PackageJSONConverter`} class.
 */
export function PackageJSONConverterTests(): void
{
    suite(
        nameof(PackageJSONConverter),
        () =>
        {
            let context = TestContext.Default;
            let testPackage: Package;
            let destinationPath: string;
            let converter: PackageJSONConverter;

            setup(
                () =>
                {
                    testPackage = new Package(
                        {
                            name: context.RandomString
                        });

                    destinationPath = context.RandomString;
                    converter = new PackageJSONConverter(destinationPath);
                });

            suite(
                nameof(PackageJSONConverter.constructor),
                () =>
                {
                    test(
                        "Checking whether the destination-path can be omitted…",
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    converter = new PackageJSONConverter();
                                    converter.Parse(stringify(testPackage.ToJSON()));
                                });
                        });
                });

            suite(
                nameof<PackageJSONConverter>((converter) => converter.Parse),
                () =>
                {
                    test(
                        "Checking whether the package is parsed correctly…",
                        () =>
                        {
                            ok(converter.Parse(stringify(testPackage.ToJSON())) instanceof Package);
                            deepStrictEqual(converter.Parse(stringify(testPackage.ToJSON())).ToJSON(), testPackage.ToJSON());
                        });

                    test(
                        `Checking whether the \`${nameof<PackageJSONConverter>((c) => c.DestinationPath)}\` is applied correctly…`,
                        () =>
                        {
                            strictEqual(converter.Parse(stringify(testPackage.ToJSON())).FileName, destinationPath);
                        });

                    test(
                        `Checking whether the \`${nameof<PackageJSONConverter>((c) => c.DestinationPath)}\` can be changed after initializing the \`${nameof(PackageJSONConverter)}\`…`,
                        () =>
                        {
                            converter.DestinationPath = context.RandomString;
                            strictEqual(converter.Parse(stringify(testPackage.ToJSON())).FileName, converter.DestinationPath);
                        });
                });

            suite(
                nameof<PackageJSONConverter>((converter) => converter.Dump),
                () =>
                {
                    test(
                        `Checking whether \`${nameof(Package)}\`s are dumped correctly…`,
                        () =>
                        {
                            deepStrictEqual(parse(converter.Dump(testPackage)), testPackage.ToJSON());
                        });
                });
        });
}
