import { Generator, IComponentCollection, IFileMapping, FileMapping, IComponentCategory, IComponent, Component, IGenerator } from "@manuth/extended-yo-generator";
import { CompositeConstructor } from "@manuth/extended-yo-generator/lib/CompositeConstructor";
import { GeneratorConstructor } from "@manuth/extended-yo-generator/lib/GeneratorConstructor";
import { DroneFileMapping } from "./DroneFileMapping";
import { MarkdownFileProcessor } from "./MarkdownFileProcessor";

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
    public static Create<T extends GeneratorConstructor>(base: T, namespaceOrPath?: string): CompositeConstructor<T>
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
            public get BaseComponents(): IComponentCollection<any, any>
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
                                            FileMappings: MyTSProjectGenerator.ProcessFileMappings(this.Base, new Component(this, componentOptions).FileMappings)
                                        };
                                    })
                            };
                        })
                };
            }

            /**
             * @inheritdoc
             */
            public get BaseFileMappings(): Array<IFileMapping<any, any>>
            {
                return MyTSProjectGenerator.ProcessFileMappings(this.Base, super.BaseFileMappings);
            }

            /**
             * @inheritdoc
             */
            public get Components(): IComponentCollection<any, any>
            {
                let components = super.Components;

                for (let category of components.Categories)
                {
                    if (category.DisplayName === "General")
                    {
                        category.Components.push(
                            {
                                ID: "drone-configuration",
                                DisplayName: "Drone-CI Configuration",
                                DefaultEnabled: true,
                                FileMappings: [
                                    new DroneFileMapping(this)
                                ]
                            });
                    }
                }

                return components;
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
        for (let i = 0; i < fileMappings.length; i++)
        {
            let fileMappingOptions = fileMappings[i];
            let fileMapping = new FileMapping(generator, fileMappingOptions);

            fileMappings[i] = {
                Destination: fileMapping.Destination,
                Processor: async () =>
                {
                    if (fileMapping.Destination.endsWith(".md"))
                    {
                        return new MarkdownFileProcessor(generator, fileMappingOptions).Processor();
                    }
                    else
                    {
                        return fileMapping.Processor();
                    }
                }
            };
        }

        return fileMappings;
    }
}
