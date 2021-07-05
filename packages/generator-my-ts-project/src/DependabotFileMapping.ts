import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { YAMLTransformMapping } from "@manuth/generator-ts-project";
import { join } from "upath";
import { Document } from "yaml";

/**
 * Provides the functionality to create a dependabot configuration.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class DependabotFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends YAMLTransformMapping<TSettings, TOptions>
{
    /**
     * The relative filename of the dependabot-configuration.
     */
    private relativeFileName: string = join(".github", "dependabot.yml");

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return this.Generator.commonTemplatePath(this.RelativeFileName);
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.RelativeFileName;
    }

    /**
     * Gets the relative filename of the dependabot-configuration.
     */
    protected get RelativeFileName(): string
    {
        return this.relativeFileName;
    }

    /**
     * @inheritdoc
     *
     * @param documents
     * The documents to transform.
     *
     * @returns
     * The transformed documents.
     */
    public override async Transform(documents: Document.Parsed[]): Promise<Document.Parsed[]>
    {
        let document = documents[0];
        let updateKey = "updates";
        let configurations: any[] = document.get(updateKey).toJSON();

        for (let i = configurations.length - 1; i > 0; i--)
        {
            document.deleteIn([updateKey, i]);
        }

        document.setIn([updateKey, 0, "directory"], "/");
        return [document];
    }
}
