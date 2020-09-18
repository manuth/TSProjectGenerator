import { FileMapping, GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONTransformMapping } from "../../Components/Transformation/JSONTransformMapping";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";

/**
 * Provides the functionality to create file-mappings for a code workspace.
 */
export abstract class CodeFileMappingCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `CodeFileMappingCreator` class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        this.component = component;
    }

    /**
     * Gets the component of this file-mapping creator.
     */
    public get Component(): CodeWorkspaceComponent<TSettings, TOptions>
    {
        return this.component;
    }

    /**
     * Gets the generator of this file-mapping creator.
     */
    public get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the file-mappings for creating the workspace.
     */
    public abstract get FileMappings(): Array<IFileMapping<TSettings, TOptions>>;

    /**
     * Creates a file-mapping for writing the specified `data` to a file located at the specified `filePath`.
     *
     * @param filePath
     * The path to copy the json-content to.
     *
     * @param data
     * The data to copy.
     *
     * @returns
     * The newly created file-mapping.
     */
    protected CreateJSONMapping<T>(filePath: string, data: T | Promise<T>): IFileMapping<TSettings, TOptions>
    {
        return {
            Destination: filePath,
            Processor: async (fileMapping, generator) =>
            {
                await new FileMapping(
                    generator,
                    new class extends JSONTransformMapping<TSettings, TOptions, T>
                    {
                        /**
                         * @inheritdoc
                         */
                        public get Source(): string
                        {
                            return null;
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): string
                        {
                            return fileMapping.Destination;
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Metadata(): Promise<any>
                        {
                            return Promise.resolve(data);
                        }
                    }(generator)).Processor();
            }
        };
    }
}
