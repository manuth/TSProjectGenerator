import { ok } from "node:assert";
import { extname, isAbsolute, relative } from "node:path";
import { FileMapping, GeneratorOptions, IComponent, IComponentCategory, IFileMapping } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings, Predicate, TSConfigFileMapping, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { TSConfigJSON } from "types-tsconfig";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator.js";
import { MarkdownFileProcessor } from "../MarkdownFileProcessor.js";
import { MyGeneratorComponent } from "../MyGeneratorComponent.js";
import type { MyTSProjectGenerator } from "../MyTSProjectGenerator.js";
import { MyTSProjectPackageFileMapping } from "../MyTSProjectPackageFileMapping.js";
import { TestTSModuleGenerator } from "./TestTSModuleGenerator.js";

/**
 * Registers tests for the {@link MyTSProjectGenerator `MyTSProjectGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function MyTSProjectGeneratorTests(context: TestContext<TestTSModuleGenerator>): void
{
    suite(
        nameof<MyTSProjectGenerator<any>>(),
        () =>
        {
            let transformPluginName = "ts-nameof";
            let tsconfigFileName = TSConfigFileMapping.GetFileName("base");
            let generator: TestTSModuleGenerator;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                });

            suite(
                nameof<MyTSModuleGenerator>((generator) => generator.Components),
                () =>
                {
                    /**
                     * Asserts that the specified {@link predicate `predicate`} applies to at least one category.
                     *
                     * @param predicate
                     * The predicate which is expected to apply to at least one category.
                     */
                    function AssertCategory(predicate: Predicate<IComponentCategory<any, any>>): void
                    {
                        ok(generator.Components.Categories.some(predicate));
                    }

                    /**
                     * Asserts that a component with the specified {@link id `id`} exists.
                     *
                     * @param id
                     * The id of the component whose existence to assert.
                     */
                    function AssertComponentExists(id: string): void
                    {
                        AssertComponent((component) => component.ID === id);
                    }

                    /**
                     * Asserts that a component which applies to the specified {@link predicate `predicate`} exists.
                     *
                     * @param predicate
                     * The predicate which is expected to apply to at least one component.
                     */
                    function AssertComponent(predicate: Predicate<IComponent<any, any>>): void
                    {
                        AssertCategory((category) => category.Components.some(predicate));
                    }

                    test(
                        "Checking whether all expected categories are present…",
                        () =>
                        {
                            AssertCategory((category) => category.DisplayName === "Workflows");
                        });

                    test(
                        "Checking whether all expected components are present…",
                        () =>
                        {
                            AssertComponentExists(MyGeneratorComponent.CodeQLAnalysisWorkflow);
                        });
                });

            suite(
                nameof<TestTSModuleGenerator>((generator) => generator.BaseFileMappings),
                () =>
                {
                    test(
                        `Checking whether all markdown-files from the \`${nameof<TestTSModuleGenerator>((g) => g.Base)}\` are wrapped in a \`${nameof(MarkdownFileProcessor)}\`…`,
                        () =>
                        {
                            for (let fileMapping of generator.BaseFileMappings.Items)
                            {
                                if (extname(fileMapping.Destination) === ".md")
                                {
                                    ok(fileMapping.Object instanceof MarkdownFileProcessor);
                                }
                            }
                        });

                    test(
                        `Checking whether all \`${nameof(TSProjectPackageFileMapping)}\`s are replaced with \`${nameof(MyTSProjectPackageFileMapping)}\`s…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            for (let baseFileMapping of generator.BaseFileMappings.Items)
                            {
                                if (baseFileMapping.Object instanceof TSProjectPackageFileMapping)
                                {
                                    let fileMapping = generator.FileMappingCollection.Get(
                                        (fileMapping: FileMapping<any, any>) =>
                                        {
                                            return fileMapping.Destination === baseFileMapping.Destination;
                                        });

                                    while (nameof<FileMapping<any, any>>((fm) => fm.Object) in fileMapping.Object)
                                    {
                                        fileMapping = fileMapping.Object as FileMapping<any, any>;
                                    }

                                    ok(fileMapping.Object instanceof MyTSProjectPackageFileMapping);
                                }
                            }
                        });

                    test(
                        `Checking whether the \`${transformPluginName}\`-plugin is configured in \`${tsconfigFileName}\`…`,
                        async () =>
                        {
                            let fileMapping = generator.BaseFileMappings.Get(
                                (fileMapping: FileMapping<any, any>) => (
                                    isAbsolute(fileMapping.Destination) ?
                                        relative(fileMapping.Generator.destinationPath(), fileMapping.Destination) :
                                        fileMapping.Destination) === tsconfigFileName);

                            let tester = new JSONCFileMappingTester<TestTSModuleGenerator, ITSProjectSettings, GeneratorOptions, IFileMapping<ITSProjectSettings, GeneratorOptions>, TSConfigJSON>(generator, fileMapping);

                            ok(
                                (await tester.ParseOutput()).compilerOptions.plugins.some(
                                    (plugin: any) => plugin.transform === transformPluginName));
                        });
                });
        });
}
