import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { ITSProjectSettings } from "../../Project/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/TSProjectSettingKey";
import { LintRuleset } from "../LintRuleset";

/**
 * Provides a file-mapping for the `.eslintrc.js` file.
 */
export class ESLintRCFileMapping<T extends ITSProjectSettings> extends FileMappingBase<T>
{
    /**
     * Initializes a new instance of the `ESLintRCFileMapping<T>` class.
     */
    public constructor()
    {
        super();
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
