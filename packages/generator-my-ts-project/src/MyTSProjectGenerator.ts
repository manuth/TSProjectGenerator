import { BaseGeneratorFactory, ComponentCollection, FileMapping, FileMappingCollectionEditor, GeneratorConstructor, GeneratorExtensionConstructor, GeneratorOptions, IComponentCollection, IGenerator } from "@manuth/extended-yo-generator";
import { JSONCConverter, JSONCCreatorMapping, TSConfigFileMapping, TSProjectGenerator, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
// eslint-disable-next-line node/no-unpublished-import
import type { TSConfigJSON } from "types-tsconfig";
import { join } from "upath";
import { DependabotFileMapping } from "./DependabotFileMapping";
import { DroneFileMapping } from "./DroneFileMapping";
import { MarkdownFileProcessor } from "./MarkdownFileProcessor";
import { MyGeneratorComponent } from "./MyGeneratorComponent";
import { MyTSProjectPackageFileMapping } from "./MyTSProjectPackageFileMapping";

/**
 * Provides the functionality to create base-constructors.
 */
export class MyTSProjectGenerator<T extends GeneratorConstructor<TSProjectGenerator<any, any>>> extends BaseGeneratorFactory<T>
{
    /**
     * Initializes a new instance of the {@link MyTSProjectGenerator `MyTSProjectGenerator`} class.
     */
    protected constructor()
    {
        super();
    }

    /**
     * Gets the default instance of the {@link MyTSProjectGenerator `MyTSProjectGenerator<T>`} class.
     */
    protected static override get Default(): MyTSProjectGenerator<any>
    {
        return new MyTSProjectGenerator();
    }

    /**
     * @inheritdoc
     *
     * @template TBase
     * The type of the constructor of the base generator.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified {@link base `base`}-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public static override Create<TBase extends GeneratorConstructor>(base: TBase, namespaceOrPath?: string): GeneratorExtensionConstructor<TBase>
    {
        return this.Default.Create(base, namespaceOrPath);
    }

    /**
     * Creates a new base-constructor.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified {@link base `base`}-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public override Create(base: T, namespaceOrPath?: string): GeneratorExtensionConstructor<T>
    {
        let baseClass = super.Create(base, namespaceOrPath);
        let self = this;

        /**
         * Represents a base-generator inheriting the specified base.
         */
        class BaseGenerator extends baseClass
        {
            /**
             * Initializes a new instance of the {@link BaseGenerator `BaseGenerator`} class.
             *
             * @param args
             * The arguments for creating the base generator.
             *
             * @param options
             * A set of options for the generator.
             */
            public constructor(args: string | string[], options: GeneratorOptions)
            {
                super(args, options);
            }

            /**
             * @inheritdoc
             */
            protected override get BaseComponents(): ComponentCollection<any, any>
            {
                let components = super.BaseComponents;

                components.Categories.Replace(
                    () => true,
                    (item) =>
                    {
                        item.Components.Replace(
                            () => true,
                            (item) =>
                            {
                                self.ProcessFileMappings(this, item.FileMappings);
                                return item;
                            });

                        return item;
                    });

                return components;
            }

            /**
             * @inheritdoc
             */
            protected override get BaseFileMappings(): FileMappingCollectionEditor
            {
                let result = super.BaseFileMappings;
                self.ProcessFileMappings(this, result);
                return result;
            }

            /**
             * @inheritdoc
             */
            public override get Components(): IComponentCollection<any, any>
            {
                let components = super.Components;
                let workflowDirName = join(".github", "workflows");
                let mergeWorkflowFileName = join(workflowDirName, "auto-merge.yml");
                let codeAnalysisWorkflowFileName = join(workflowDirName, "codeql-analysis.yml");

                for (let category of components.Categories)
                {
                    if (category.DisplayName === "General")
                    {
                        category.Components.push(
                            {
                                ID: MyGeneratorComponent.Drone,
                                DisplayName: "Drone-CI Configuration",
                                DefaultEnabled: true,
                                FileMappings: [
                                    new DroneFileMapping(this)
                                ]
                            },
                            {
                                ID: MyGeneratorComponent.Dependabot,
                                DisplayName: "Dependabot Configuration",
                                DefaultEnabled: true,
                                FileMappings: [
                                    new DependabotFileMapping(this)
                                ]
                            });
                    }
                }

                components.Categories.push(
                    {
                        DisplayName: "Workflows",
                        Components: [
                            {
                                ID: MyGeneratorComponent.AutoMergeWorkflow,
                                DisplayName: "Dependabot Auto-Merge Workflow",
                                DefaultEnabled: true,
                                FileMappings: [
                                    {
                                        Source: this.commonTemplatePath(mergeWorkflowFileName),
                                        Destination: join(mergeWorkflowFileName)
                                    }
                                ]
                            },
                            {
                                ID: MyGeneratorComponent.CodeQLAnalysisWorkflow,
                                DisplayName: "CodeQL Analysis Workflow",
                                DefaultEnabled: true,
                                FileMappings: [
                                    {
                                        Source: this.commonTemplatePath(codeAnalysisWorkflowFileName),
                                        Destination: join(codeAnalysisWorkflowFileName)
                                    }
                                ]
                            }
                        ]
                    });

                return components;
            }

            /**
             * @inheritdoc
             */
            public override async cleanup(): Promise<void>
            {
                return this.Base.cleanup();
            }
        }

        return BaseGenerator as any;
    }

    /**
     * Processes the file-mappings.
     *
     * @param generator
     * The generator to process the file-mappings for.
     *
     * @param fileMappings
     * The file-mappings to process.
     *
     * @returns
     * The processed file-mappings.
     */
    protected ProcessFileMappings(generator: IGenerator<any, any>, fileMappings: FileMappingCollectionEditor): void
    {
        fileMappings.ReplaceObject(
            (fileMapping: FileMapping<any, any>) => fileMapping.Destination.endsWith(".md"),
            (fileMapping) => new MarkdownFileProcessor(generator, fileMapping.Result));

        fileMappings.ReplaceObject(
            TSProjectPackageFileMapping,
            (fileMapping) => new MyTSProjectPackageFileMapping(generator, fileMapping.Object as TSProjectPackageFileMapping<any, any>));

        fileMappings.ReplaceObject(
            (fileMapping: FileMapping<any, any>) => fileMapping.Destination === generator.destinationPath(TSConfigFileMapping.GetFileName("base")),
            (fileMapping) =>
            {
                return {
                    Source: fileMapping.Source,
                    Destination: fileMapping.Destination,
                    Processor: async (target, generator) =>
                    {
                        let originalConfig: TSConfigJSON = new JSONCConverter().Parse(generator.fs.read(target.Source));
                        await fileMapping.Processor();
                        let tsConfig: TSConfigJSON = new JSONCConverter().Parse(generator.fs.read(target.Destination));
                        tsConfig.compilerOptions.plugins = originalConfig.compilerOptions.plugins;
                        return new JSONCCreatorMapping(generator, target.Destination, tsConfig).Processor();
                    }
                };
            });
    }
}
