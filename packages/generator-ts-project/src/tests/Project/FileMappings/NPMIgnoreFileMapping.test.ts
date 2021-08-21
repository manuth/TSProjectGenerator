import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { NPMIgnoreFileMappingTester } from "@manuth/generator-ts-project-test";
import { fileName as eslintFileName } from "types-eslintrc";
import { fileName } from "types-tsconfig";
import { changeExt } from "upath";
import { NPMIgnoreFileMapping } from "../../../Project/FileMappings/NPMIgnoreFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link NPMIgnoreFileMapping `NPMIgnoreFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function NPMIgnoreFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof<NPMIgnoreFileMapping<any, any>>(),
        () =>
        {
            let generator: TSProjectGenerator;
            let fileMapping: NPMIgnoreFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: NPMIgnoreFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, NPMIgnoreFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    fileMapping = new NPMIgnoreFileMapping(generator);
                    tester = new NPMIgnoreFileMappingTester(generator, fileMapping);
                });

            setup(
                async () =>
                {
                    await tester.Run();
                });

            suite(
                nameof(NPMIgnoreFileMapping.FileName),
                () =>
                {
                    test(
                        "Checking whether the proper file-name is returned…",
                        () =>
                        {
                            strictEqual(NPMIgnoreFileMapping.FileName, ".npmignore");
                        });
                });

            suite(
                nameof<NPMIgnoreFileMapping<any, any>>((fileMapping) => fileMapping.DefaultBaseName),
                () =>
                {
                    test(
                        `Checking whether the default base-name equals \`${nameof(NPMIgnoreFileMapping)}.${nameof(NPMIgnoreFileMapping.FileName)}\`…`,
                        () =>
                        {
                            strictEqual(fileMapping.DefaultBaseName, NPMIgnoreFileMapping.FileName);
                        });
                });

            suite(
                nameof<NPMIgnoreFileMapping<any, any>>((fileMapping) => fileMapping.BaseName),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<NPMIgnoreFileMapping<any, any>>((fm) => fm.BaseName)}\` equals the \`${nameof<NPMIgnoreFileMapping<any, any>>((fm) => fm.DefaultBaseName)}\`…`,
                        () =>
                        {
                            strictEqual(fileMapping.BaseName, fileMapping.DefaultBaseName);
                        });
                });

            suite(
                nameof<NPMIgnoreFileMapping<any, any>>((fileMapping) => fileMapping.Processor),
                () =>
                {
                    test(
                        "Checking whether ignore-files are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertIgnored(NPMIgnoreFileMapping.FileName);
                        });

                    test(
                        "Checking whether TypeScript-configurations are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertIgnored(fileName);
                        });

                    test(
                        "Checking whether eslint-files are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertIgnored(eslintFileName);
                            await tester.AssertIgnored(changeExt(eslintFileName, ".js"));
                        });

                    test(
                        "Checking whether mocha-files are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertIgnored(".mocharc.json");
                        });

                    test(
                        "Checking whether vscode-files are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertDirectoryIgnored(".vscode");
                        });

                    test(
                        "Checking whether github-files are ignored…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.AssertDirectoryIgnored(".github");
                        });
                });
        });
}
