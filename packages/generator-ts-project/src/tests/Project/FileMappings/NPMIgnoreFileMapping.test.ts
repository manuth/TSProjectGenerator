import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { IRunContext } from "@manuth/extended-yo-generator-test";
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
            let generatorContext: IRunContext<TSProjectGenerator>;
            let generator: TSProjectGenerator;
            let fileMappingOptions: NPMIgnoreFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: NPMIgnoreFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, NPMIgnoreFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generatorContext = context.ExecuteGenerator();
                    await generatorContext;
                    generator = generatorContext.generator;
                    fileMappingOptions = new NPMIgnoreFileMapping(generator);
                    tester = new NPMIgnoreFileMappingTester(generator, fileMappingOptions);
                });

            suite(
                nameof<NPMIgnoreFileMapping<any, any>>((fileMapping) => fileMapping.Processor),
                () =>
                {
                    test(
                        "Checking whether ignore-files are ignored…",
                        async () =>
                        {
                            await tester.AssertIgnored(NPMIgnoreFileMapping.DefaultBaseName);
                        });

                    test(
                        "Checking whether TypeScript-configurations are ignored…",
                        async () =>
                        {
                            await tester.AssertIgnored(fileName);
                        });

                    test(
                        "Checking whether eslint-files are ignored…",
                        async () =>
                        {
                            await tester.AssertIgnored(eslintFileName);
                            await tester.AssertIgnored(changeExt(eslintFileName, ".js"));
                        });

                    test(
                        "Checking whether mocha-files are ignored…",
                        async () =>
                        {
                            await tester.AssertIgnored(".mocharc.json");
                        });

                    test(
                        "Checking whether vscode-files are ignored…",
                        async () =>
                        {
                            await tester.AssertDirectoryIgnored(".vscode");
                        });

                    test(
                        "Checking whether github-files are ignored…",
                        async () =>
                        {
                            await tester.AssertDirectoryIgnored(".github");
                        });
                });
        });
}
