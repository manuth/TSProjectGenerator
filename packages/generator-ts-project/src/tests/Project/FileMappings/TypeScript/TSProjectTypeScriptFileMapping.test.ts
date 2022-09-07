import { strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { PackageType } from "@manuth/package-json-editor";
import { ITempNameOptions, TempFileSystem } from "@manuth/temp-files";
import { ImportDeclarationStructure, OptionalKind } from "ts-morph";
import path from "upath";
import { TSProjectTypeScriptFileMapping } from "../../../../Project/FileMappings/TypeScript/TSProjectTypeScriptFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";

const { join } = path;

/**
 * Registers tests for the {@link TSProjectTypeScriptFileMapping `TSProjectTypeScriptFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectTypeScriptFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectTypeScriptFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link TSProjectTypeScriptFileMapping `TSProjectTypeScriptFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptFileMapping extends TSProjectTypeScriptFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return fileName;
                }

                /**
                 * @inheritdoc
                 */
                public override get ESModule(): boolean
                {
                    return super.ESModule;
                }

                /**
                 * @inheritdoc
                 *
                 * @param fileName
                 * The name of the file to get an import to.
                 *
                 * @param leadingTrivia
                 * The leading white spaces or comments of the import.
                 *
                 * @returns
                 * The import-declaration for importing the specified {@link fileName `fileName`}.
                 */
                public override GetImportDeclaration(fileName: string, leadingTrivia?: string): Promise<OptionalKind<ImportDeclarationStructure>>
                {
                    return super.GetImportDeclaration(fileName, leadingTrivia);
                }
            }

            let fileName: string;
            let generator: TSProjectGenerator;
            let fileMapping: TestTypeScriptFileMapping;

            /**
             * Sets the value indicating whether an ESModule project should be generated.
             *
             * @param value
             * The value to set.
             */
            function SetESModule(value: boolean): void
            {
                generator.Settings[TSProjectSettingKey.ESModule] = value;
            }

            /**
             * Gets a temporary file name for a typescript file.
             *
             * @param options
             * The options for creating a filename.
             *
             * @returns
             * A temporary file name for a typescript file.
             */
            function GetTypeScriptFileName(options?: ITempNameOptions): string
            {
                return join(
                    options?.Directory ?? generator.destinationPath(generator.SourceRoot),
                    TempFileSystem.TempBaseName(
                        {
                            Suffix: ".ts",
                            ...options
                        }));
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    fileMapping = new TestTypeScriptFileMapping(generator);
                });

            setup(
                () =>
                {
                    fileName = GetTypeScriptFileName();
                });

            suite(
                nameof<TestTypeScriptFileMapping>((fileMapping) => fileMapping.ESModule),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestTypeScriptFileMapping>((f) => f.ESModule)}\` property represents whether an \`${nameof(PackageType.ESModule)}\` is being generated…`,
                        () =>
                        {
                            for (let value of [true, false])
                            {
                                SetESModule(value);
                                strictEqual(fileMapping.ESModule, value);
                            }
                        });
                });
        });
}
