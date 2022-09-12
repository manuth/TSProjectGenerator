import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { fileURLToPath } from "node:url";
import { ESLintRule, GenerateESLintConfiguration } from "@manuth/eslint-plugin-typescript";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { PackageType } from "@manuth/package-json-editor";
import { ITempNameOptions, TempDirectory, TempFileSystem } from "@manuth/temp-files";
import { ESLint } from "eslint";
import { ExportAssignmentStructure, ImportDeclarationStructure, OptionalKind } from "ts-morph";
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

                /**
                 * @inheritdoc
                 *
                 * @param expression
                 * The expression to export.
                 *
                 * @returns
                 * The declaration for exporting the specified {@link expression `expression`}.
                 */
                public override GetMainExportDeclaration(expression: string): OptionalKind<ExportAssignmentStructure>
                {
                    return super.GetMainExportDeclaration(expression);
                }
            }

            let dirName: string;
            let indexName = TSProjectTypeScriptFileMapping.IndexFileName;
            let jsExtension = TSProjectTypeScriptFileMapping.JavaScriptFileExtension;
            let fileName: string;
            let tempDir: TempDirectory;
            let generator: TSProjectGenerator;
            let fileMapping: TestTypeScriptFileMapping;
            let tester: TypeScriptFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, TestTypeScriptFileMapping>;

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
                    options?.Directory ?? generator.SourceRoot,
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
                    dirName = fileURLToPath(new URL(".", import.meta.url));
                    generator = await context.Generator;
                    fileMapping = new TestTypeScriptFileMapping(generator);
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                });

            setup(
                () =>
                {
                    fileName = GetTypeScriptFileName();
                    tempDir = new TempDirectory();
                    generator.destinationRoot(tempDir.FullName);
                });

            teardown(
                () =>
                {
                    tempDir.Dispose();
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

                    /**
                     * Asserts that the specified {@link importDeclaration `importDeclaration`} points to the file with the specified {@link fileName `fileName`}.
                     *
                     * @param importDeclaration
                     * The import to check.
                     *
                     * @param fileName
                     * The name of the file the {@link importDeclaration `importDeclaration`} should point to.
                     */
                    function AssertImportFile(importDeclaration: OptionalKind<ImportDeclarationStructure>, fileName: string): void
                    {
                        fileName = normalize(generator.destinationPath(fileName));
                        strictEqual(GetFullPath(importDeclaration.moduleSpecifier), fileName);
                    }

                    setup(
                        () =>
                        {
                            testFileName = GetTypeScriptFileName();
                        });

                    suite(
                        "General",
                        () =>
                        {
                            test(
                                "Checking whether a leading trivia can be added to import declarations…",
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    let leadingTrivia = context.RandomString;
                                    let importDeclaration = await fileMapping.GetImportDeclaration(testFileName, leadingTrivia);
                                    strictEqual(importDeclaration.leadingTrivia, leadingTrivia);
                                });
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
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    generator.destinationRoot("test");
                                    let importDeclaration = await fileMapping.GetImportDeclaration(testFileName);
                                    AssertImportFile(importDeclaration, changeExt(testFileName, jsExtension));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is not stripped for \`${nameof(PackageType.ESModule)}\` projects…`,
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    let fileName = GetIndexFileName();
                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    AssertImportFile(importDeclaration, changeExt(fileName, jsExtension));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of parent paths is not stripped for \`${nameof(PackageType.ESModule)}\` projects…`,
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);

                                    let fileName = GetIndexFileName(
                                        {
                                            Directory: "."
                                        });

                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    AssertImportFile(importDeclaration, changeExt(fileName, jsExtension));
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
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    let importDeclaration = await fileMapping.GetImportDeclaration(testFileName);
                                    AssertImportFile(importDeclaration, changeExt(testFileName, ""));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is stripped if present for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    let fileName = GetIndexFileName();
                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    AssertImportFile(importDeclaration, dirname(fileName));
                                });

                            test(
                                `Checking whether the \`${indexName}\` portion of paths is stripped from parent directories for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);

                                    let fileName = GetIndexFileName(
                                        {
                                            Directory: "."
                                        });

                                    let importDeclaration = await fileMapping.GetImportDeclaration(fileName);
                                    AssertImportFile(importDeclaration, dirname(fileName));
                                });
                        });
                });

            suite(
                nameof<TestTypeScriptFileMapping>((fileMapping) => fileMapping.GetMainExportDeclaration),
                () =>
                {
                    let randomObject: any;

                    setup(
                        async () =>
                        {
                            randomObject = context.RandomObject;
                        });

                    /**
                     * Dumps an export statement exporting the specified {@link exportValue `exportValue`} to the destination of the {@link fileMapping `fileMapping`}.
                     *
                     * @param exportValue
                     * The value to add as an export.
                     */
                    async function DumpExport(exportValue: any): Promise<void>
                    {
                        let sourceFile = await fileMapping.GetSourceObject();
                        sourceFile.addExportAssignment(fileMapping.GetMainExportDeclaration(JSON.stringify(exportValue)));
                        await tester.DumpOutput(sourceFile);
                        sourceFile.forget();
                    }

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
                                `Checking whether a default export is created for \`${nameof(PackageType.ESModule)}\` projects…`,
                                () =>
                                {
                                    let exportDeclaration = fileMapping.GetMainExportDeclaration(randomObject);
                                    ok(!exportDeclaration.isExportEquals);
                                });

                            test(
                                "Checking whether the default export has the expected value…",
                                async function()
                                {
                                    this.timeout(1 * 60 * 1000);
                                    this.slow(0.5 * 60 * 1000);
                                    await DumpExport(randomObject);
                                    deepStrictEqual(await tester.ImportDefault(), randomObject);
                                });

                            test(
                                "Checking whether the code does not break the `no-default-export` eslint rule…",
                                async function()
                                {
                                    this.timeout(30 * 1000);
                                    this.slow(15 * 1000);

                                    let linter = new ESLint(
                                        {
                                            useEslintrc: false,
                                            cwd: dirName,
                                            overrideConfig: GenerateESLintConfiguration(false, false)
                                        });

                                    await DumpExport(randomObject);

                                    let result = await linter.lintText(await tester.ReadOutput());

                                    ok(
                                        !result.some(
                                            (result) =>
                                            {
                                                return result.messages.some(
                                                    (message) =>
                                                    {
                                                        return message.ruleId === ESLintRule.ImportNoDefaultExport;
                                                    });
                                            }));
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
                                `Checking whether an \`export =\`-statement is created for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async () =>
                                {
                                    let exportDeclaration = fileMapping.GetMainExportDeclaration(JSON.stringify({}));
                                    ok(exportDeclaration.isExportEquals);
                                });

                            test(
                                `Checking whether the specified value is assigned to \`${nameof.full(module.exports)}\` for \`${nameof(PackageType.CommonJS)}\` projects…`,
                                async function()
                                {
                                    this.timeout(15 * 1000);
                                    this.slow(7.5 * 1000);
                                    await DumpExport(randomObject);
                                    deepStrictEqual(await tester.Require(), randomObject);
                                });
                        });
                });
        });
}
