import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Expression, printNode, SourceFile, SyntaxKind, ts } from "ts-morph";
import { TypeScriptCreatorMapping } from "../../../Components/TypeScriptCreatorMapping.js";

/**
 * Provides the functionality to create an `index.ts`-file for a module.
 */
export abstract class ModuleIndexFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TypeScriptCreatorMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ModuleIndexFileMapping `ModuleIndexFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param sourceFile
     * The sourceFile to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, sourceFile?: SourceFile)
    {
        super(generator, sourceFile);
    }

    /**
     * Gets the expression to assign to `export`.
     *
     * @returns
     * The value to assign to `export`.
     */
    protected async GetModuleExportValue(): Promise<Expression>
    {
        let result = this.WrapNode(ts.factory.createArrowFunction([], [], [], null, null, ts.factory.createBlock([])));
        result.setIsAsync(true);

        result.setReturnType(
            printNode(
                ts.factory.createTypeReferenceNode(
                    nameof(Promise),
                    [
                        ts.factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)
                    ])));

        result.addStatements(
            this.WrapExpression(
                this.WrapNode(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(nameof(console)),
                            nameof(console.log)),
                        [],
                        [
                            ts.factory.createStringLiteral("Hello World")
                        ]))).getFullText());

        return result;
    }

    /**
     * @inheritdoc
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed data.
     */
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        sourceFile = await super.Transform(sourceFile);

        sourceFile.addExportAssignment(
            {
                expression: (await this.GetModuleExportValue()).getFullText()
            });

        return sourceFile;
    }
}
