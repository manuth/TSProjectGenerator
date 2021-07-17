import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IDumper } from "../../Components/Transformation/Conversion/IDumper";
import { JSONCConverter } from "../../Components/Transformation/Conversion/JSONCConverter";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";

/**
 * Provides the functionality to create file-mappings for a code workspace.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class CodeFileMappingCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link CodeFileMappingCreator `CodeFileMappingCreator<TSettings, TOptions>`} class.
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
     * Gets a component for dumping json-code.
     */
    protected get Dumper(): IDumper<any>
    {
        return new JSONCConverter();
    }
}
