import { IFileMapping, FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { LintRuleset } from "../../Linting/LintRuleset";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectSettingKey } from "../TSProjectSettingKey";

/**
 * Provides a file-mapping for the `.eslintrc.js` file.
 */
export class ESLintRCFileMapping<T extends ITSProjectSettings> implements IFileMapping<T>
{
    /**
     * Initializes a new instance of the `ESLintRCFileMapping` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return ".eslintrc.js.ejs";
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return ".eslintrc.js";
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The context of the file-mapping.
     */
    public async Context(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<any>
    {
        let preset: string;

        switch (generator.Settings[TSProjectSettingKey.LintRuleset])
        {
            case LintRuleset.Weak:
                preset = "weak-requiring-type-checking";
                break;
            case LintRuleset.Recommended:
            default:
                preset = "recommended-requiring-type-checking";
                break;
        }

        return {
            preset
        };
    }
}
