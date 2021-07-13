import { ComponentOptions, GeneratorOptions, IFileMapping, IGenerator, Question } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { ESLintRCFileMapping } from "../FileMappings/ESLintRCFileMapping";
import { LintingQuestion } from "../Inquiry/LintingQuestion";

/**
 * Provides a component which allows creating files for linting the workspace.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class LintingComponent<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link LintingComponent `LintingComponent<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return TSProjectComponent.Linting;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "ESLint configurations";
    }

    /**
     * @inheritdoc
     */
    public override get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public override get Questions(): Array<Question<TSettings>>
    {
        return [
            new LintingQuestion(this.Generator)
        ];
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [
            new ESLintRCFileMapping(this.Generator),
            {
                Source: this.Generator.modulePath("tsconfig.eslint.json"),
                Destination: "tsconfig.eslint.json"
            }
        ];
    }
}
