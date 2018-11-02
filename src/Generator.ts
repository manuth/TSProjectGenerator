import { ChoiceType, Question, Separator } from "inquirer";
import Path = require("path");
import { isNullOrUndefined } from "util";
import YeomanGenerator = require("yeoman-generator");
import { GeneratorSetting } from "./GeneratorSetting";
import { IComponentProvider } from "./IComponentProvider";
import { IGeneratorSettings } from "./IGeneratorSettings";

/**
 * Represents a yeoman-generator.
 */
export abstract class Generator extends YeomanGenerator
{
    /**
     * The settings of the generator.
     */
    private settings: IGeneratorSettings = {
        [GeneratorSetting.Components]: [],
        [GeneratorSetting.ComponentPaths]: {}
    };

    /**
     * Initializes a new instance of the `Generator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    /**
     * Gets the name of the root of the template-folder.
     */
    protected abstract get TemplateRoot(): string;

    /**
     * Gets the questions to ask before executing the generator.
     */
    protected get Questions(): YeomanGenerator.Question[]
    {
        return [];
    }

    /**
     * Gets the components provided by the generator.
     */
    protected get ProvidedComponents(): IComponentProvider
    {
        return null;
    }

    /**
     * Gets the settings of the generator.
     */
    protected get Settings()
    {
        return this.settings;
    }

    /**
     * Joins the arguments together and returns the resulting path relative to the template-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    public templatePath(...path: string[])
    {
        return Path.join(__dirname, "..", "templates", this.TemplateRoot, ...path);
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting()
    {
        let questions: YeomanGenerator.Questions = [];
        let components: ChoiceType[] = [];

        if (this.ProvidedComponents !== null)
        {
            for (let category of this.ProvidedComponents.Categories)
            {
                components.push(new Separator(category.DisplayName));

                for (let component of category.Components)
                {
                    components.push({
                        value: component.ID,
                        name: component.DisplayName
                    });

                    if (typeof component.Destination !== "string")
                    {
                        let question: Question<IGeneratorSettings> = {
                            type: "input",
                            name: `${GeneratorSetting.ComponentPaths}[${JSON.stringify(component.ID)}]`,
                            message: component.Destination.Message,
                            when: answers =>
                            {
                                return (answers[GeneratorSetting.Components].includes(component.ID));
                            }
                        };

                        if (!isNullOrUndefined(component.Destination.Default))
                        {
                            question.default = component.Destination.Default;
                        }

                        questions.push(question as YeomanGenerator.Question);
                    }

                    if (!isNullOrUndefined(component.Questions))
                    {
                        questions.push(...component.Questions);
                    }
                }
            }

            questions.unshift(
                {
                    type: "checkbox",
                    name: GeneratorSetting.Components,
                    message: this.ProvidedComponents.Question,
                    choices: components
                });
        }

        questions.unshift(...this.Questions);
        Object.assign(this.Settings, await this.prompt(questions));
    }

    public async writing()
    {
        for (let category of this.ProvidedComponents.Categories)
        {
            for (let component of category.Components)
            {
                if (this.Settings[GeneratorSetting.Components].includes(component.ID))
                {
                    if (
                        !isNullOrUndefined(component.Template) &&
                        !isNullOrUndefined(component.Destination))
                    {
                        let destinationPath = typeof component.Destination === "string" ? component.Destination : this.Settings[GeneratorSetting.ComponentPaths][component.ID];

                        this.fs.copyTpl(
                            Path.isAbsolute(component.Template) ? this.templatePath(component.Template) : component.Template,
                            Path.isAbsolute(destinationPath) ? destinationPath : this.destinationPath(destinationPath),
                            this.Settings);
                    }
                }
            }
        }
    }
}