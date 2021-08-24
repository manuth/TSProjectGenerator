import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSProjectSettingKey, YAMLTransformMapping } from "@manuth/generator-ts-project";
import { Document } from "yaml";

/**
 * Provides the functionality to create a `drone.yml` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class DroneFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends YAMLTransformMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link DroneFileMapping `DroneFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets the base name of the file.
     */
    public get BaseName(): string
    {
        return ".drone.yml";
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return this.Generator.modulePath(this.BaseName);
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.BaseName;
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
        let stepsKey = "steps";
        let commandsKey = "commands";
        let stepNameKey = "name";
        let imageKey = "image";
        let steps: any[] = document.get(stepsKey).toJSON();
        document.set("name", this.Generator.Settings[TSProjectSettingKey.DisplayName]);

        for (let i = 0; i < steps.length; i++)
        {
            let step = steps[i];
            let commands: string[] = step[commandsKey];

            for (let j = 0; j < commands.length; j++)
            {
                let command = commands[j];

                if (command.startsWith("npx lerna publish"))
                {
                    document.setIn(
                        [stepsKey, i, commandsKey, j],
                        command.replace(/^npx lerna (publish) from-package -y/, "npm $1"));
                }
                else if (command.startsWith("npx lerna exec"))
                {
                    document.setIn(
                        [stepsKey, i, commandsKey, j],
                        command.replace(/^npx lerna exec .* --[\s]*(.*)$/, "$1"));
                }
            }

            if (step[stepNameKey] === "test")
            {
                document.setIn(
                    [stepsKey, i, imageKey],
                    (step[imageKey] as string).replace(/:lts$/, ""));
            }

            if (step.image === "plugins/github-release")
            {
                document.setIn([stepsKey, i, "settings", "files", "0"], "*.tgz");
            }
        }

        return [document];
    }
}
