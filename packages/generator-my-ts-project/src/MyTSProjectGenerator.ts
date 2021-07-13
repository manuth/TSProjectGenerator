import { BaseGeneratorFactory, ComponentCollection, FileMapping, FileMappingCollectionEditor, GeneratorConstructor, GeneratorExtensionConstructor, GeneratorOptions, IComponentCollection, IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectGenerator, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
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
            public override get BaseComponents(): ComponentCollection<any, any>
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
                                item.FileMappings.ReplaceObject(
                                    () => true,
                                    (item) =>
                                    {
                                        return MyTSProjectGenerator.ProcessFileMapping(this.Base, item);
                                    });

                                return item;
                            });

                        return item;
                    });

                return components;
            }

            /**
             * @inheritdoc
             */
            public override get BaseFileMappings(): FileMappingCollectionEditor
            {
                let result = super.BaseFileMappings;

                result.ReplaceObject(
                    () => true,
                    (fileMapping) =>
                    {
                        return MyTSProjectGenerator.ProcessFileMapping(this.Base, fileMapping);
                    });

                return result;
            }

            /**
             * @inheritdoc
             */
            public override get Components(): IComponentCollection<any, any>
            {
                let components = super.Components;

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
                                        Source: this.commonTemplatePath(".github", "workflows", "auto-merge.yml"),
                                        Destination: join(".github", "workflows", "auto-merge.yml")
                                    }
                                ]
                            },
                            {
                                ID: MyGeneratorComponent.CodeQLAnalysisWorkflow,
                                DisplayName: "CodeQL Analysis Workflow",
                                DefaultEnabled: true,
                                FileMappings: [
                                    {
                                        Source: this.commonTemplatePath(".github", "workflows", "codeql-analysis.yml"),
                                        Destination: join(".github", "workflows", "codeql-analysis.yml")
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
     * The generator of the file-mappings.
     *
     * @param fileMappingOptions
     * The file-mapping options to process.
     *
     * @returns
     * The processed file-mappings.
     */
    protected static ProcessFileMapping(generator: IGenerator<any, any>, fileMappingOptions: IFileMapping<any, any>): IFileMapping<any, any>
    {
        let fileMapping = new FileMapping(generator, fileMappingOptions);
        let tsConfigPath = generator.destinationPath("tsconfig.base.json");

        if (fileMapping.Destination.endsWith(".md"))
        {
            fileMappingOptions = new MarkdownFileProcessor(generator, fileMapping);
        }

        if (fileMappingOptions instanceof TSProjectPackageFileMapping)
        {
            fileMappingOptions = new MyTSProjectPackageFileMapping(generator);
        }

        if (fileMapping.Destination === tsConfigPath)
        {
            fileMappingOptions = {
                Source: fileMapping.Source,
                Destination: fileMapping.Destination,
                Processor: async (target, generator) =>
                {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    let originalConfig = require(target.Source);
                    await fileMapping.Processor();
                    let tsConfig = generator.fs.readJSON(target.Destination) as any;
                    tsConfig.compilerOptions.plugins = originalConfig.compilerOptions.plugins;
                    generator.fs.writeJSON(target.Destination, tsConfig, null, 4);
                }
            };
        }

        return fileMappingOptions;
    }
}
