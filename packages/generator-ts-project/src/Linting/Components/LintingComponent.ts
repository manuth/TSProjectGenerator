import { GeneratorOptions, Question, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { ESLintRCFileMapping } from "../FileMappings/ESLintRCFileMapping";
import { LintingQuestion } from "../Inquiry/LintingQuestion";

/**
 * Provides a component which allows creating files for linting the workspace.
 */
export class LintingComponent<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `LintingComponent` class.
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
    public get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [
            new LintingQuestion(this.Generator)
        ];
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Promise<Array<IFileMapping<TSettings, TOptions>>>
    {
        return (
            async () =>
            {
                return [
                    new ESLintRCFileMapping(this.Generator),
                    {
                        Source: this.Generator.modulePath("tsconfig.eslint.json"),
                        Destination: "tsconfig.eslint.json"
                    }
                ];
            })();
    }
}
