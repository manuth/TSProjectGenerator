import { resolve } from "path";
import { Question } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import kebabCase = require("lodash.kebabcase");
import { isAbsolute, basename, join } from "upath";
import validate = require("validate-npm-package-name");
import { ITSProjectSettings } from "./ITSProjectSettings";
import { TSProjectSettingKey } from "./TSProjectSettingKey";

/**
 * Provides a set of questions for generating a project.
 */
export class ProjectQuestionCollection<T extends ITSProjectSettings>
{
    /**
     * The question for asking for the destionation-path of the project.
     */
    private destinationQuestion: Question<T> = {
        type: "input",
        name: TSProjectSettingKey.Destination,
        message: "Where do you want to save your project to?",
        default: "./",
        filter: (input) => isAbsolute(input) ? input : resolve(process.cwd(), input)
    };

    /**
     * The question for asking for the human-readable name of the project.
     */
    private displayNameQuestion: Question<T> = {
        type: "input",
        name: TSProjectSettingKey.DisplayName,
        message: "What's the name of your project?",
        default: (answers: T) => basename(answers[TSProjectSettingKey.Destination]),
        validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
    };

    /**
     * The question for asking for the module-name of the project.
     */
    private moduleNameQuestion: Question<T> = {
        type: "input",
        name: TSProjectSettingKey.Name,
        message: "What's the name of the npm package?",
        default: (answers: T) => kebabCase(answers[TSProjectSettingKey.DisplayName]),
        validate: (input: string) =>
        {
            let result = validate(input);
            let errors = (result.errors ?? []).concat(result.warnings ?? []);

            if (result.validForNewPackages)
            {
                return true;
            }
            else
            {
                return errors[0] ?? "Please provide a name according to the npm naming-conventions.";
            }
        }
    };

    /**
     * The question for asking for the description of the project.
     */
    private descriptionQuestion: Question<T> = {
        type: "input",
        name: TSProjectSettingKey.Description,
        message: "Please enter a description for your project.",
        default: async (answers: T) =>
        {
            let npmPackage = new Package(join(answers[TSProjectSettingKey.Destination], ".json"), {});
            await npmPackage.Normalize();
            return npmPackage.Description;
        }
    };

    /**
     * Initializes a new instance of the `ProjectQuestionCollection` class.
     */
    public constructor()
    { }

    /**
     * Gets the question for asking for the destionation-path of the project.
     */
    public get DestinationQuestion(): Question<T>
    {
        return this.destinationQuestion;
    }

    /**
     * Gets the question for asking for the human-readable name of the project.
     */
    public get DisplayNameQuestion(): Question<T>
    {
        return this.displayNameQuestion;
    }

    /**
     * Gets the question for asking for the module-name of the project.
     */
    public get ModuleNameQuestion(): Question<T>
    {
        return this.moduleNameQuestion;
    }

    /**
     * Gets the question for asking for the description of the project.
     */
    public get DescriptionQuestion(): Question<T>
    {
        return this.descriptionQuestion;
    }

    /**
     * Gets the questions in this collection.
     */
    public get Questions(): Array<Question<T>>
    {
        return [
            this.DestinationQuestion,
            this.DisplayNameQuestion,
            this.ModuleNameQuestion,
            this.DescriptionQuestion
        ];
    }
}
