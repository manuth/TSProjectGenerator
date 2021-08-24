import { deepStrictEqual, ok } from "assert";
import { Document, parseAllDocuments, parseDocument, stringify } from "yaml";
import { YAMLConverter } from "../../../../Components/Transformation/Conversion/YAMLConverter";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link YAMLConverter `YAMLConverter`} class.
 */
export function YAMLConverterTests(): void
{
    suite(
        nameof(YAMLConverter),
        () =>
        {
            let context = TestContext.Default;
            let testDocument: any;
            let multiDocuments: Document[];
            let multiDocumentText: string;
            let converter: YAMLConverter;
            let directivesMarker = "---";

            setup(
                () =>
                {
                    testDocument = context.RandomObject;
                    multiDocuments = [];
                    converter = new YAMLConverter();

                    for (let i = context.Random.integer(2, 10); i > 0; i--)
                    {
                        let document = new Document();
                        document.contents = context.RandomObject;
                        multiDocuments.push(document);
                    }

                    multiDocumentText = multiDocuments.map((doc) => doc.toString()).join("\n---\n");
                });

            suite(
                nameof<YAMLConverter>((converter) => converter.Parse),
                () =>
                {
                    test(
                        "Checking whether documents can be parsed…",
                        () =>
                        {
                            deepStrictEqual(
                                converter.Parse(stringify(testDocument)).map((document) => document.toJSON()),
                                [testDocument]);
                        });

                    test(
                        "Checking whether multiple documents can be parsed at once…",
                        () =>
                        {
                            deepStrictEqual(
                                converter.Parse(multiDocumentText).map((document) => document.toJSON()),
                                multiDocuments.map((document) => document.toJSON()));
                        });
                });

            suite(
                nameof<YAMLConverter>((converter) => converter.Dump),
                () =>
                {
                    test(
                        "Checking whether a single document can be dumped…",
                        () =>
                        {
                            let document = new Document();
                            document.contents = testDocument;
                            deepStrictEqual(parseDocument(converter.Dump([document])).toJSON(), parseDocument(document.toString()).toJSON());
                        });

                    test(
                        "Checking whether multiple documents can be dumped…",
                        () =>
                        {
                            deepStrictEqual(
                                parseAllDocuments(converter.Dump(multiDocuments)).map((document) => document.toJSON()),
                                parseAllDocuments(multiDocumentText).map((document) => document.toJSON()));
                        });

                    test(
                        `Checking whether the leading directives marker (\`${directivesMarker}\`) remain…`,
                        () =>
                        {
                            ok(converter.Dump(parseAllDocuments(directivesMarker + "\n" + multiDocumentText)).startsWith(directivesMarker));
                        });
                });
        });
}
