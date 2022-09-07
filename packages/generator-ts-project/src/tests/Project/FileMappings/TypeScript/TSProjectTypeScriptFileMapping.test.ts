import { strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { PackageType } from "@manuth/package-json-editor";
import { ITempNameOptions, TempFileSystem } from "@manuth/temp-files";
import { ImportDeclarationStructure, OptionalKind } from "ts-morph";
import path from "upath";
import { TSProjectTypeScriptFileMapping } from "../../../../Project/FileMappings/TypeScript/TSProjectTypeScriptFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";

const { dirname, join, normalize, changeExt, resolve } = path;

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

            let indexName = TSProjectTypeScriptFileMapping.IndexFileName;
            let jsExtension = TSProjectTypeScriptFileMapping.JavaScriptFileExtension;
            let fileName: string;
            let generator: TSProjectGenerator;
            let fileMapping: TestTypeScriptFileMapping;
            let tester: FileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, TestTypeScriptFileMapping>;

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

            /**
             * Gets a file name for an index typescript file.
             *
             * @param options
             * The options for creating a filename.
             *
             * @returns
             * A file name for an index typescript file.
             */
            function GetIndexFileName(options?: ITempNameOptions): string
            {
                return GetTypeScriptFileName(
                    {
                        FileNamePattern: indexName,
                        Prefix: "",
                        ...options
                    });
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    fileMapping = new TestTypeScriptFileMapping(generator);
                    tester = new FileMappingTester(generator, fileMapping);
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

            suite(
                nameof<TestTypeScriptFileMapping>((fileMapping) => fileMapping.GetImportDeclaration),
                () =>
                {
                    let testFileName: string;

                    /**
                     * Gets the full path of the specified {@link moduleSpecifier `moduleSpecifier`}.
                     *
                     * @param moduleSpecifier
                     * The specifier to resolve.
                     *
                     * @returns
                     * The full path of the specified {@link moduleSpecifier `moduleSpecifier`}.
                     */
                    function GetFullPath(moduleSpecifier: string): string
                    {
                        return normalize(resolve(dirname(tester.FileMapping.Destination), moduleSpecifier));
                    }

                    setup(
                        () =>
                        {
                            testFileName = GetTypeScriptFileName();
                        });

                    suite(
                        nameof(PackageType.ESModule),
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    SetESModule(true);
                                });

                            test(
                                `Checking whether import declarations include a \`.${jsExtension}\` file extension for \`${nameof(PackageType.ESModule)}\` projects…`,
                                async () =>
                                {
                                    let importDeclaration = await fileMapping.GetImportDeclaration(testFileName);
                                    strictEqual(changeExt(testFileName, jsExtension), GetFullPath(importDeclaration.moduleSpecifier));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is not stripped for \`${nameof(PackageType.ESModule)}\` projects…`,
                                async () =>
                                {
                                    let fileName = GetIndexFileName();
                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    strictEqual(changeExt(fileName, jsExtension), GetFullPath(importDeclaration.moduleSpecifier));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of parent paths is not stripped for \`${nameof(PackageType.ESModule)}\` projects…`,
                                async () =>
                                {
                                    let fileName = GetIndexFileName(
                                        {
                                            Directory: generator.destinationPath()
                                        });

                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    strictEqual(changeExt(fileName, jsExtension), GetFullPath(importDeclaration.moduleSpecifier));
                                });
                        });

                    suite(
                        nameof(PackageType.CommonJS),
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    SetESModule(false);
                                });

                            test(
                                `Checking whether the import declarations do not include file extensions for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async () =>
                                {
                                    let importDeclaration = await fileMapping.GetImportDeclaration(testFileName);
                                    strictEqual(changeExt(testFileName, ""), GetFullPath(importDeclaration.moduleSpecifier));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is stripped if present for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async () =>
                                {
                                    let importDeclaration = await fileMapping.GetImportDeclaration(GetIndexFileName());
                                    strictEqual(GetFullPath(importDeclaration.moduleSpecifier), dirname(GetIndexFileName()));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is stripped from parent directories for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async () =>
                                {
                                    let importDeclaration = await fileMapping.GetImportDeclaration(
                                        GetIndexFileName(
                                            {
                                                Directory: generator.destinationPath()
                                            }));

                                    strictEqual(GetFullPath(importDeclaration.moduleSpecifier), generator.destinationPath());
                                });
                        });
                });
        });
}
