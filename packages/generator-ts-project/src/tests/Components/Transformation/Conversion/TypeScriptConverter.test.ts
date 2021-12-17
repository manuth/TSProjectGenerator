import { doesNotThrow, strictEqual } from "assert";
import { EOL } from "os";
import { TempFileSystem } from "@manuth/temp-files";
import detectNewLine = require("detect-newline");
import { FormatCodeSettings, NodeFlags, printNode, Project, SourceFile, ts } from "ts-morph";
import { TypeScriptConverter } from "../../../../Components/Transformation/Conversion/TypeScriptConverter";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link TypeScriptConverter `TypeScriptConverter`} class.
 */
export function TypeScriptConverterTests(): void
{
    suite(
        nameof(TypeScriptConverter),
        () =>
        {
            let context = TestContext.Default;
            let testVariableName = "test";
            let testSourceFile: SourceFile;
            let destinationPath: string;
            let converter: TypeScriptConverter;

            setup(
                () =>
                {
                    destinationPath = context.RandomString;
                    converter = new TypeScriptConverter(destinationPath);

                    testSourceFile = new Project().createSourceFile(
                        TempFileSystem.TempName(),
                        {
                            statements:
                                printNode(ts.factory.createVariableStatement(
                                    [],
                                    ts.factory.createVariableDeclarationList(
                                        [
                                            ts.factory.createVariableDeclaration(testVariableName)
                                        ],
                                        NodeFlags.Let)))
                        });
                });

            suite(
                nameof(TypeScriptConverter.constructor),
                () =>
                {
                    test(
                        "Checking whether the destination-path can be omitted…",
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    converter = new TypeScriptConverter();
                                    converter.Parse(testSourceFile.getFullText());
                                });
                        });
                });

            suite(
                nameof<TypeScriptConverter>((converter) => converter.Parse),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<SourceFile>()}\`s are parsed correctly…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    converter.Parse(testSourceFile.getFullText()).getVariableDeclarationOrThrow(testVariableName);
                                });
                        });
                });

            suite(
                nameof<TypeScriptConverter>((converter) => converter.Dump),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<SourceFile>()}\`s are dumped correctly…`,
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            let sourceFile = new Project().createSourceFile(
                                TempFileSystem.TempName(),
                                converter.Dump(testSourceFile),
                                {
                                    overwrite: true
                                });

                            doesNotThrow(
                                () =>
                                {
                                    sourceFile.getVariableDeclarationOrThrow(testVariableName);
                                });

                            sourceFile.forget();
                        });

                    test(
                        `Checking whether the \`${nameof<FormatCodeSettings>()}\` can be adjusted…`,
                        () =>
                        {
                            for (let nlc of [EOL, "\n", "\r\n"])
                            {
                                converter.FormatSettings.newLineCharacter = nlc;
                                strictEqual(detectNewLine(converter.Dump(testSourceFile)), nlc);
                            }
                        });
                });
        });
}
