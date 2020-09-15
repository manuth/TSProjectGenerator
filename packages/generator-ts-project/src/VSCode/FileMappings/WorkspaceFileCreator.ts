import { EOL } from "os";
import { GeneratorOptions, IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { split } from "eol";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "./CodeFileMappingCreator";

/**
 * Provides the functionality to create file-mappings for a workspace-file.
 */
export class WorkspaceFileCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeFileMappingCreator<TSettings, TOptions>
{
    /**
     * The name of the file to write the workspace-file to.
     */
    private fileName: string;

    /**
     * Initializes a new instance of the `WorkspaceFileCreator` class.
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
            {
                Destination: this.FileName,
                Processor: async (fileMapping, generator) =>
                {
                    generator.fs.write(fileMapping.Destination, split(JSON.stringify(await this.Component.WorkspaceMetadata, null, 4)).join(EOL));
                }
            }
        ];
    }
}
