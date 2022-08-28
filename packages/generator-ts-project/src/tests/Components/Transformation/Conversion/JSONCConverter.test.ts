import { deepStrictEqual, ok, strictEqual } from "assert";
import { EOL } from "os";
import { stringify } from "comment-json";
import detectNewline from "detect-newline";
import { JSONCConverter } from "../../../../Components/Transformation/Conversion/JSONCConverter.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link JSONCConverter `JSONCConverter<T>`} class.
 */
export function JSONCConverterTests(): void
{
    suite(
        nameof(JSONCConverter),
        () =>
        {
            /**
             * Represents a test-object.
             */
            interface ITestObject
            {
                /**
                 * A test-value.
                 */
                Value: any;
            }

            let context = TestContext.Default;
            let testObject: ITestObject;
            let converter: JSONCConverter<ITestObject>;

            setup(
                () =>
                {
                    testObject = {
                        Value: context.RandomObject
                    };

                    converter = new JSONCConverter();
                });

            suite(
                nameof<JSONCConverter<any>>((converter) => converter.Parse),
                () =>
                {
                    test(
                        "Checking whether `.json`-code is parsed correctly…",
                        () =>
                        {
                            deepStrictEqual(converter.Parse(stringify(testObject)), testObject);
                        });

                    test(
                        "Checking whether `.json`-code with comments is parsed correctly…",
                        () =>
                        {
                            deepStrictEqual(
                                converter.Parse(
                                    `
                                        // Test-comment
                                        ${stringify(testObject)}`),
                                testObject);
                        });
                });

            suite(
                nameof<JSONCConverter<any>>((converter) => converter.Dump),
                () =>
                {
                    test(
                        "Checking whether objects are dumped correctly…",
                        () =>
                        {
                            deepStrictEqual(
                                converter.Parse(converter.Dump(testObject)),
                                converter.Parse(stringify(testObject)));
                        });

                    test(
                        `Checking whether a trailing EOL-character is added if \`${nameof<JSONCConverter<any>>((c) => c.EOLLast)}\` is enabled…`,
                        () =>
                        {
                            converter.EOLLast = false;
                            ok(!converter.Dump(testObject).endsWith(converter.NewLineCharacter));
                            converter.EOLLast = true;
                            ok(converter.Dump(testObject).endsWith(converter.NewLineCharacter));
                        });

                    test(
                        `Checking whether the new-line character can be customized using the \`${nameof<JSONCConverter<any>>((c) => c.NewLineCharacter)}\`-property…`,
                        () =>
                        {
                            for (
                                let nlc of [
                                    EOL,
                                    "\n",
                                    "\r\n"
                                ])
                            {
                                converter.NewLineCharacter = nlc;
                                strictEqual(detectNewline(converter.Dump(testObject)), nlc);
                            }
                        });
                });
        });
}
