import { PresetName } from "@manuth/eslint-plugin-typescript";
import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
// eslint-disable-next-line node/no-unpublished-import
import type { Linter } from "eslint";
import { ExportAssignment, Node, SourceFile } from "ts-morph";
import { fileName } from "types-eslintrc";
import upath from "upath";
import { TypeScriptTransformMapping } from "../../Components/Transformation/TypeScriptTransformMapping.js";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey.js";
import { LintRuleset } from "../LintRuleset.js";

const { changeExt } = upath;

/**
 * Provides a file-mapping for the `.eslintrc.js` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ESLintRCFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TypeScriptTransformMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ESLintRCFileMapping `ESLintRCFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets the default name of the file.
     */
    public static get FileName(): string
    {
        return changeExt(fileName, ".js");
    }

    /**
     * Gets the default base-name of the file.
     */
    public get DefaultBaseName(): string
    {
        return ESLintRCFileMapping.FileName;
    }

    /**
     * Gets the base-name of the file.
     */
    public get BaseName(): string
    {
        return this.DefaultBaseName;
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
     * Processes the specified {@link sourceFile `sourceFile`}.
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed source-file.
     */
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        let preset: string;

        switch (this.Generator.Settings[TSProjectSettingKey.LintRuleset])
        {
            case LintRuleset.Weak:
                preset = nameof(PresetName.WeakWithTypeChecking);
                break;
            case LintRuleset.Recommended:
            default:
                preset = nameof(PresetName.RecommendedWithTypeChecking);
                break;
        }

        let exports = sourceFile.getStatements().find(
            (statement): statement is ExportAssignment =>
            {
                if (Node.isExpressionStatement(statement))
                {
                    let expression = statement.getExpression();

                    if (Node.isBinaryExpression(expression))
                    {
                        return expression.getLeft().getText() === `${nameof(module)}.${nameof(module.exports)}`;
                    }
                }

                return false;
            });

        let exportsAssignment = exports.getExpression();

        if (Node.isBinaryExpression(exportsAssignment))
        {
            let eslintConfig = exportsAssignment.getRight();

            if (Node.isObjectLiteralExpression(eslintConfig))
            {
                let extendsProperty = eslintConfig.getProperty(nameof<Linter.Config>((config) => config.extends));
                eslintConfig.getProperty(nameof<Linter.Config>((config) => config.root)).remove();
                eslintConfig.getProperty(nameof<Linter.Config>((config) => config.ignorePatterns)).remove();

                if (Node.isPropertyAssignment(extendsProperty))
                {
                    let extendsValue = extendsProperty.getInitializer();

                    if (Node.isArrayLiteralExpression(extendsValue))
                    {
                        for (let item of extendsValue.getElements())
                        {
                            if (Node.isTemplateExpression(item))
                            {
                                for (let templateSpan of item.getTemplateSpans())
                                {
                                    let presetNameProperty = templateSpan.getExpression();

                                    if (Node.isPropertyAccessExpression(presetNameProperty) &&
                                        presetNameProperty.getExpression().getText() === nameof(PresetName))
                                    {
                                        presetNameProperty.getNameNode().replaceWithText(preset);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return sourceFile;
    }
}
