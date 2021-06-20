import { Component, CompositeConstructor, FileMapping, Generator, GeneratorConstructor, IComponent, IComponentCategory, IComponentCollection, IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
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
export abstract class MyTSProjectGenerator
{
    /**
     * Initializes a new instance of the `MyTSProjectGenerator` class.
     */
    private constructor()
    { }

    /**
     * Creates a new base-constructor.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified `base`-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public static Create<T extends GeneratorConstructor<TSProjectGenerator>>(base: T, namespaceOrPath?: string): CompositeConstructor<T>
    {
        let baseClass = Generator.ComposeWith(base, namespaceOrPath);

        /**
         * Represents a base-generator iheriting the specified base.
         */
        class BaseGenerator extends baseClass
        {
            /**
             * Initializes a new instance of the `BaseGenerator` class.
             *
             * @param params
             * The arguments of the constructor.
             */
            public constructor(...params: any[])
            {
                super(...params);
            }

            /**
             * @inheritdoc
             */
            public override get BaseComponents(): IComponentCollection<any, any>
            {
                let components = super.BaseComponents;

                return {
                    Question: components.Question,
                    Categories: components.Categories.map(
                        (category): IComponentCategory<any, any> =>
                        {
                            return {
                                DisplayName: category.DisplayName,
                                Components: category.Components.map(
                                    (componentOptions): IComponent<any, any> =>
                                    {
                                        return {
                                            ID: componentOptions.ID,
                                            DisplayName: componentOptions.DisplayName,
                                            DefaultEnabled: componentOptions.DefaultEnabled,
                                            Questions: componentOptions.Questions,
                                            FileMappings: (component, generator) =>
                                            {
                                                let fileMappings = new Component(generator, componentOptions).FileMappings;
                                                return MyTSProjectGenerator.ProcessFileMappings(this.Base, fileMappings);
                                            }
                                        };
                                    })
                            };
                        })
                };
            }

            /**
             * @inheritdoc
             */
            public override get BaseFileMappings(): Array<IFileMapping<any, any>>
            {
                return MyTSProjectGenerator.ProcessFileMappings(this.Base, super.BaseFileMappings);
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
     * @param fileMappings
     * The file-mappings to process.
     *
     * @returns
     * The processed file-mappings.
     */
    protected static ProcessFileMappings(generator: IGenerator<any, any>, fileMappings: Array<IFileMapping<any, any>>): Array<IFileMapping<any, any>>
    {
        let tsConfigPath = generator.destinationPath("tsconfig.base.json");

        for (let i = 0; i < fileMappings.length; i++)
        {
            let fileMappingOptions = fileMappings[i];
            let fileMapping = new FileMapping(generator, fileMappingOptions);

            if (fileMapping.Destination.endsWith(".md"))
            {
                fileMappings[i] = new MarkdownFileProcessor(generator, fileMapping);
            }

            if (fileMappingOptions instanceof TSProjectPackageFileMapping)
            {
                fileMappings[i] = new MyTSProjectPackageFileMapping(generator);
            }

            if (fileMapping.Destination === tsConfigPath)
            {
                fileMappings[i] = {
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
        }

        return fileMappings;
    }
}
