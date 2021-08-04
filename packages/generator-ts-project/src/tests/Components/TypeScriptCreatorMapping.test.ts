import { doesNotReject, doesNotThrow, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { Project, SourceFile } from "ts-morph";
import { TypeScriptCreatorMapping } from "../../Components/TypeScriptCreatorMapping";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class.
 */
export function TypeScriptCreatorMappingTests(): void
{
    suite(
        nameof(TypeScriptCreatorMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptCreatorMapping extends TypeScriptCreatorMapping<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return tempFile.FullName;
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let tempFile: TempFile;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    tempFile = new TempFile();
                });

            teardown(
                () =>
                {
                    tempFile.Dispose();
                });

            suite(
                nameof(TypeScriptCreatorMapping.constructor),
                () =>
                {
                    test(
                        `Checking whether the argument containing the base \`${nameof<SourceFile>()}\` can be omitted…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    new TestTypeScriptCreatorMapping(generator);
                                });
                        });

                    test(
                        `Checking whether a base \`${nameof<SourceFile>()}\` can be passed…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    new TestTypeScriptCreatorMapping(generator, new Project().createSourceFile(tempFile.FullName, null, { overwrite: true }));
                                });
                        });
                });

            suite(
                nameof<TypeScriptCreatorMapping<any, any>>((fileMapping) => fileMapping.GetSourceObject),
                () =>
                {
                    test(
                        `Checking whether a new \`${nameof<SourceFile>()}\` is created if no \`${nameof<SourceFile>()}\` has been passed to the \`${nameof(TypeScriptCreatorMapping.constructor)}\`…`,
                        async () =>
                        {
                            strictEqual(
                                (await new TestTypeScriptCreatorMapping(generator).GetSourceObject()).getFilePath(),
                                new Project().createSourceFile(tempFile.FullName, null, { overwrite: true }).getFilePath());
                        });

                    test(
                        `Checking whether the \`${nameof<SourceFile>()}\` is loaded from the \`${nameof(TypeScriptCreatorMapping.constructor)}\`-parameter, if specified…`,
                        async () =>
                        {
                            let variableName = "test";
                            let sourceFile = new Project().createSourceFile(tempFile.FullName, null, { overwrite: true });

                            sourceFile.addVariableStatement(
                                {
                                    declarations: [
                                        {
                                            name: variableName
                                        }
                                    ]
                                });

                            doesNotReject(
                                async () =>
                                {
                                    (await new TestTypeScriptCreatorMapping(generator).GetSourceObject()).getVariableDeclarationOrThrow(variableName);
                                });
                        });
                });
        });
}
