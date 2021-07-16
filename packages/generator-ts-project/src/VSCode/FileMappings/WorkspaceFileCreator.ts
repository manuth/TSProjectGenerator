import { GeneratorOptions, IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONCCreatorMapping } from "../../Components/JSONCCreatorMapping";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "./CodeFileMappingCreator";

/**
 * Provides the functionality to create file-mappings for a workspace-file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class WorkspaceFileCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeFileMappingCreator<TSettings, TOptions>
{
    /**
     * The name of the file to write the workspace-file to.
     */
    private fileName: string;

    /**
     * Initializes a new instance of the {@link WorkspaceFileCreator `WorkspaceFileCreator<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the file-mapping creator.
     *
     * @param fileName
     * The name of the file to write the workspace-file to.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>, fileName: string)
    {
        super(component);
        this.fileName = fileName;
    }

    /**
     * Gets the name of the file to write the workspace-file to.
     */
    public get FileName(): string
    {
        return this.fileName;
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [
            new JSONCCreatorMapping(this.Generator, this.FileName, this.Component.WorkspaceMetadata)
        ];
    }
}
