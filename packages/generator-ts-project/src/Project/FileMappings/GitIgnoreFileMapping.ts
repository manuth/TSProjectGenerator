import { IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { NPMIgnoreFileMapping } from "./NPMIgnoreFileMapping";

/**
 * Provides the functionality to copy the `.gitignore` file.
 */
export class GitIgnoreFileMapping<T extends ITSProjectSettings> extends NPMIgnoreFileMapping<T>
{
    /**
     * Initializes a new instance of the `GitIgnoreFileMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(".gitignore");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return ".gitignore";
            })();
    }

    /**
     * Gets the name of the patch file.
     */
    protected get PatchFileName(): string
    {
        return this.Generator.commonTemplatePath("gitignore.diff");
    }
}
