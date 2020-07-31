import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { VSCodeWorkspaceFileMapping } from "./VSCodeWorkspaceFileMapping";

/**
 * Provides a file-mapping for a vscode workspace file written in `.json` or `.jsonc`.
 */
export abstract class VSCodeJSONFileMapping<T extends IGeneratorSettings> extends VSCodeWorkspaceFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeJSONFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * Gets the metadata to write into the file.
     */
    protected abstract get Metadata(): Promise<any>;

    /**
     * @inheritdoc
     */
    public async Processor(): Promise<void>
    {
        this.Generator.fs.write(await this.Resolved.Destination, JSON.stringify(await this.Metadata, null, 4));
    }
}
