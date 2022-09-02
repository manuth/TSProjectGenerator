import { EOL } from "node:os";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import { Generator, GeneratorOptions, IComponent, IComponentCategory, IComponentCollection, IFileMapping, IGenerator, IGeneratorSettings, Question } from "@manuth/extended-yo-generator";
import chalk from "chalk";
import { ChoiceOptions, ListQuestion } from "inquirer";
import { ConstructorDeclarationStructure, OptionalKind, printNode, Scope, SourceFile, SyntaxKind, ts } from "ts-morph";
import { GeneratorTypeScriptMapping } from "./GeneratorTypeScriptMapping.js";
import { NamingContext } from "./NamingContext.js";

const { whiteBright } = chalk;

/**
 * Provides the functionality to create a file which provides license-types.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorClassFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorTypeScriptMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link GeneratorClassFileMapping `GeneratorClassFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param namingContext
     * A component which provides constants for the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, namingContext: NamingContext)
    {
        super(generator, namingContext);
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.NamingContext.GeneratorClassFileName;
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

        sourceFile.addImportDeclarations(
            [
                {
                    moduleSpecifier: "chalk",
                    namedImports: [
                        nameof(whiteBright)
                    ]
                },
                {
                    moduleSpecifier: "@manuth/extended-yo-generator",
                    namedImports: [
                        nameof<Generator>(),
                        nameof<GeneratorOptions>(),
                        nameof<IComponentCollection<any, any>>(),
                        nameof<Question>()
                    ]
                },
                {
                    moduleSpecifier: "node:path",
                    namedImports: [
                        nameof(basename),
                        nameof(isAbsolute),
                        nameof(resolve)
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.SettingKeyFileName)),
                    namedImports: [
                        this.NamingContext.SettingKeyEnumName
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.SettingsInterfaceFileName)),
                    namedImports: [
                        this.NamingContext.SettingsInterfaceName
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.LicenseTypeFileName)),
                    namedImports: [
                        this.NamingContext.LicenseTypeEnumName
                    ]
                }
            ]);

        sourceFile.addStatements(
            [
                printNode(
                    ts.factory.createImportEqualsDeclaration(
                        [],
                        [],
                        false,
                        this.NamingContext.DedentName,
                        ts.factory.createExternalModuleReference(ts.factory.createStringLiteral("dedent")))),
                printNode(
                    ts.factory.createImportEqualsDeclaration(
                        [],
                        [],
                        false,
                        this.NamingContext.YoSayName,
                        ts.factory.createExternalModuleReference(ts.factory.createStringLiteral("yosay"))))
            ]);

        let generatorClass = sourceFile.addClass(
            {
                docs: [
                    {
                        description: `${EOL}Provides the functionality to generate a workspace.`
                    }
                ],
                isExported: true,
                name: this.NamingContext.GeneratorClassName,
                extends: printNode(
                    ts.factory.createTypeReferenceNode(
                        nameof<Generator>(),
                        [
                            ts.factory.createTypeReferenceNode(this.NamingContext.SettingsInterfaceName),
                            ts.factory.createTypeReferenceNode(nameof<GeneratorOptions>())
                        ])),
                ctors: [
                    (
                        (): OptionalKind<ConstructorDeclarationStructure> =>
                        {
                            let className = this.NamingContext.GeneratorClassName;
                            let argsParamName = "args";
                            let optionsParamName = "options";

                            return {
                                docs: [
                                    {
                                        description: `${EOL}Initializes a new instance of the {@link ${className} \`${className}\`} class.`,
                                        tags: [
                                            {
                                                leadingTrivia: EOL,
                                                tagName: "param",
                                                text: `${argsParamName}${EOL}A set of arguments for the generator.`
                                            },
                                            {
                                                leadingTrivia: EOL,
                                                tagName: "param",
                                                text: `${optionsParamName}${EOL}A set of options for the generator.`
                                            }
                                        ]
                                    }
                                ],
                                scope: Scope.Public,
                                parameters: [
                                    {
                                        name: argsParamName,
                                        type: printNode(
                                            ts.factory.createUnionTypeNode(
                                                [
                                                    ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                                                    ts.factory.createArrayTypeNode(ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword))
                                                ]))
                                    },
                                    {
                                        name: optionsParamName,
                                        type: printNode(ts.factory.createTypeReferenceNode(nameof<GeneratorOptions>()))
                                    }
                                ],
                                statements: printNode(
                                    ts.factory.createExpressionStatement(
                                        ts.factory.createCallExpression(
                                            ts.factory.createSuper(),
                                            [],
                                            [
                                                ts.factory.createIdentifier(argsParamName),
                                                ts.factory.createIdentifier(optionsParamName)
                                            ])))
                            };
                        })()
                ]
            });

        let getAccessors = generatorClass.addGetAccessors(
            [
                {
                    name: nameof<Generator>((generator) => generator.TemplateRoot),
                    returnType: printNode(ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword)),
                    statements: printNode(
                        ts.factory.createReturnStatement(
                            ts.factory.createStringLiteral(this.NamingContext.GeneratorID)))
                },
                {
                    name: nameof<Generator>((generator) => generator.Questions),
                    returnType: printNode(
                        ts.factory.createTypeReferenceNode(
                            nameof(Array),
                            [
                                ts.factory.createTypeReferenceNode(
                                    nameof<Question>(),
                                    [
                                        ts.factory.createTypeReferenceNode(this.NamingContext.SettingsInterfaceName)
                                    ])
                            ])),
                    statements: printNode(
                        ts.factory.createReturnStatement(
                            ts.factory.createArrayLiteralExpression(
                                [
                                    ts.factory.createObjectLiteralExpression(
                                        [
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.name),
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                    this.NamingContext.DestinationMember)),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.message),
                                                ts.factory.createStringLiteral("Where do you want to save your project to?")),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.default),
                                                ts.factory.createStringLiteral(".")),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.filter),
                                                (
                                                    () =>
                                                    {
                                                        let inputParamName = "input";
                                                        let destinationVariableName = "destination";

                                                        return ts.factory.createArrowFunction(
                                                            [],
                                                            [],
                                                            [
                                                                ts.factory.createParameterDeclaration(
                                                                    [],
                                                                    [],
                                                                    undefined,
                                                                    inputParamName)
                                                            ],
                                                            undefined,
                                                            undefined,
                                                            ts.factory.createBlock(
                                                                [
                                                                    ts.factory.createVariableStatement(
                                                                        [],
                                                                        ts.factory.createVariableDeclarationList(
                                                                            [
                                                                                ts.factory.createVariableDeclaration(
                                                                                    destinationVariableName,
                                                                                    undefined,
                                                                                    undefined,
                                                                                    ts.factory.createConditionalExpression(
                                                                                        ts.factory.createCallExpression(
                                                                                            ts.factory.createIdentifier(nameof(isAbsolute)),
                                                                                            [],
                                                                                            [
                                                                                                ts.factory.createIdentifier(inputParamName)
                                                                                            ]),
                                                                                        undefined,
                                                                                        ts.factory.createIdentifier(inputParamName),
                                                                                        undefined,
                                                                                        ts.factory.createCallExpression(
                                                                                            ts.factory.createIdentifier(nameof(resolve)),
                                                                                            [],
                                                                                            [
                                                                                                ts.factory.createCallExpression(
                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                        ts.factory.createIdentifier(nameof(process)),
                                                                                                        nameof(process.cwd)),
                                                                                                    [],
                                                                                                    []),
                                                                                                ts.factory.createIdentifier(inputParamName)
                                                                                            ])))
                                                                            ],
                                                                            ts.NodeFlags.Let)),
                                                                    ts.factory.createExpressionStatement(
                                                                        ts.factory.createCallExpression(
                                                                            ts.factory.createPropertyAccessExpression(
                                                                                ts.factory.createThis(),
                                                                                nameof<Generator>((generator) => generator.destinationRoot)),
                                                                            [],
                                                                            [
                                                                                ts.factory.createIdentifier(destinationVariableName)
                                                                            ])),
                                                                    ts.factory.createReturnStatement(ts.factory.createIdentifier(destinationVariableName))
                                                                ],
                                                                true));
                                                    })())
                                        ],
                                        true),
                                    ts.factory.createObjectLiteralExpression(
                                        [
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.name),
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                    this.NamingContext.NameMember)),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.message),
                                                ts.factory.createStringLiteral("What's the name of your project?")),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.default),
                                                (
                                                    () =>
                                                    {
                                                        let answersParamName = "answers";
                                                        return ts.factory.createArrowFunction(
                                                            [],
                                                            [],
                                                            [
                                                                ts.factory.createParameterDeclaration(
                                                                    [],
                                                                    [],
                                                                    undefined,
                                                                    answersParamName,
                                                                    undefined,
                                                                    ts.factory.createTypeReferenceNode(this.NamingContext.SettingsInterfaceName))
                                                            ],
                                                            undefined,
                                                            undefined,
                                                            ts.factory.createCallExpression(
                                                                ts.factory.createIdentifier(nameof(basename)),
                                                                [],
                                                                [
                                                                    ts.factory.createElementAccessExpression(
                                                                        ts.factory.createIdentifier(answersParamName),
                                                                        ts.factory.createPropertyAccessExpression(
                                                                            ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                                            this.NamingContext.DestinationMember))
                                                                ]));
                                                    })())
                                        ],
                                        true),
                                    ts.factory.createObjectLiteralExpression(
                                        [
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.name),
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                    this.NamingContext.DescriptionMember)),
                                            ts.factory.createPropertyAssignment(
                                                nameof<Question>((question) => question.message),
                                                ts.factory.createStringLiteral("Please enter a description."))
                                        ],
                                        true)
                                ],
                                true)))
                },
                {
                    name: nameof<Generator>((generator) => generator.Components),
                    returnType: printNode(
                        ts.factory.createTypeReferenceNode(
                            nameof<IComponentCollection<any, any>>(),
                            [
                                ts.factory.createTypeReferenceNode(this.NamingContext.SettingsInterfaceName),
                                ts.factory.createTypeReferenceNode(nameof<GeneratorOptions>())
                            ])),
                    statements: printNode(
                        ts.factory.createReturnStatement(
                            ts.factory.createObjectLiteralExpression(
                                [
                                    ts.factory.createPropertyAssignment(
                                        nameof<IComponentCollection<any, any>>((collection) => collection.Question),
                                        ts.factory.createStringLiteral("What do you want to include in your workspace?")),
                                    ts.factory.createPropertyAssignment(
                                        nameof<IComponentCollection<any, any>>((collection) => collection.Categories),
                                        ts.factory.createArrayLiteralExpression(
                                            [
                                                ts.factory.createObjectLiteralExpression(
                                                    [
                                                        ts.factory.createPropertyAssignment(
                                                            nameof<IComponentCategory<any, any>>((category) => category.DisplayName),
                                                            ts.factory.createStringLiteral("General")),
                                                        ts.factory.createPropertyAssignment(
                                                            nameof<IComponentCategory<any, any>>((category) => category.Components),
                                                            ts.factory.createArrayLiteralExpression(
                                                                [
                                                                    ts.factory.createObjectLiteralExpression(
                                                                        [
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.ID),
                                                                                ts.factory.createStringLiteral("readme")),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.DisplayName),
                                                                                ts.factory.createStringLiteral("`README.md`-file")),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.DefaultEnabled),
                                                                                ts.factory.createTrue()),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.FileMappings),
                                                                                ts.factory.createArrayLiteralExpression(
                                                                                    [
                                                                                        ts.factory.createObjectLiteralExpression(
                                                                                            [
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Source),
                                                                                                    ts.factory.createStringLiteral("README.md.ejs")),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Context),
                                                                                                    ts.factory.createArrowFunction(
                                                                                                        [],
                                                                                                        [],
                                                                                                        [],
                                                                                                        undefined,
                                                                                                        undefined,
                                                                                                        ts.factory.createBlock(
                                                                                                            [
                                                                                                                ts.factory.createReturnStatement(
                                                                                                                    ts.factory.createObjectLiteralExpression(
                                                                                                                        [
                                                                                                                            ts.factory.createPropertyAssignment(
                                                                                                                                "Name",
                                                                                                                                ts.factory.createElementAccessExpression(
                                                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                                                        ts.factory.createThis(),
                                                                                                                                        nameof<Generator>((generator) => generator.Settings)),
                                                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                                                        ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                                                                                                        this.NamingContext.NameMember))),
                                                                                                                            ts.factory.createPropertyAssignment(
                                                                                                                                "Description",
                                                                                                                                ts.factory.createElementAccessExpression(
                                                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                                                        ts.factory.createThis(),
                                                                                                                                        nameof<Generator>((generator) => generator.Settings)),
                                                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                                                        ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                                                                                                        this.NamingContext.DescriptionMember)))
                                                                                                                        ],
                                                                                                                        true))
                                                                                                            ],
                                                                                                            true))),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Destination),
                                                                                                    ts.factory.createStringLiteral("README.md"))
                                                                                            ],
                                                                                            true)
                                                                                    ],
                                                                                    true))
                                                                        ],
                                                                        true),
                                                                    ts.factory.createObjectLiteralExpression(
                                                                        [
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.ID),
                                                                                ts.factory.createStringLiteral("license")),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.DisplayName),
                                                                                ts.factory.createStringLiteral("`LICENSE`-file")),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.Questions),
                                                                                ts.factory.createArrayLiteralExpression(
                                                                                    [
                                                                                        ts.factory.createObjectLiteralExpression(
                                                                                            [
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<Question>((question) => question.name),
                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                        ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                                                                        this.NamingContext.LicenseTypeMember)),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<Question>((question) => question.type),
                                                                                                    ts.factory.createStringLiteral("list")),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<Question>((question) => question.message),
                                                                                                    ts.factory.createStringLiteral("What license do you want to use?")),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<ListQuestion>((question) => question.choices),
                                                                                                    ts.factory.createArrayLiteralExpression(
                                                                                                        [
                                                                                                            ts.factory.createObjectLiteralExpression(
                                                                                                                [
                                                                                                                    ts.factory.createPropertyAssignment(
                                                                                                                        nameof<ChoiceOptions>((choice) => choice.value),
                                                                                                                        ts.factory.createPropertyAccessExpression(
                                                                                                                            ts.factory.createIdentifier(this.NamingContext.LicenseTypeEnumName),
                                                                                                                            this.NamingContext.ApacheMember)),
                                                                                                                    ts.factory.createPropertyAssignment(
                                                                                                                        nameof<ChoiceOptions>((choice) => choice.name),
                                                                                                                        ts.factory.createStringLiteral("Apache-2.0 License"))
                                                                                                                ],
                                                                                                                true),
                                                                                                            ts.factory.createObjectLiteralExpression(
                                                                                                                [
                                                                                                                    ts.factory.createPropertyAssignment(
                                                                                                                        nameof<ChoiceOptions>((choice) => choice.value),
                                                                                                                        ts.factory.createPropertyAccessExpression(
                                                                                                                            ts.factory.createIdentifier(this.NamingContext.LicenseTypeEnumName),
                                                                                                                            this.NamingContext.GPLMember)),
                                                                                                                    ts.factory.createPropertyAssignment(
                                                                                                                        nameof<ChoiceOptions>((choice) => choice.name),
                                                                                                                        ts.factory.createStringLiteral("GNU GPL License"))
                                                                                                                ],
                                                                                                                true)
                                                                                                        ],
                                                                                                        true)),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<Question>((question) => question.default),
                                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                                        ts.factory.createIdentifier(this.NamingContext.LicenseTypeEnumName),
                                                                                                        this.NamingContext.GPLMember))
                                                                                            ],
                                                                                            true)
                                                                                    ],
                                                                                    true)),
                                                                            ts.factory.createPropertyAssignment(
                                                                                nameof<IComponent<any, any>>((component) => component.FileMappings),
                                                                                ts.factory.createArrayLiteralExpression(
                                                                                    [
                                                                                        ts.factory.createObjectLiteralExpression(
                                                                                            [
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Source),
                                                                                                    ts.factory.createArrowFunction(
                                                                                                        [],
                                                                                                        [],
                                                                                                        [],
                                                                                                        undefined,
                                                                                                        undefined,
                                                                                                        ts.factory.createBlock(
                                                                                                            [
                                                                                                                ts.factory.createSwitchStatement(
                                                                                                                    ts.factory.createElementAccessExpression(
                                                                                                                        ts.factory.createPropertyAccessExpression(
                                                                                                                            ts.factory.createThis(),
                                                                                                                            nameof<Generator>((generator) => generator.Settings)),
                                                                                                                        ts.factory.createPropertyAccessExpression(
                                                                                                                            ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                                                                                            this.NamingContext.LicenseTypeMember)),
                                                                                                                    ts.factory.createCaseBlock(
                                                                                                                        [
                                                                                                                            ts.factory.createCaseClause(
                                                                                                                                ts.factory.createPropertyAccessExpression(
                                                                                                                                    ts.factory.createIdentifier(this.NamingContext.LicenseTypeEnumName),
                                                                                                                                    this.NamingContext.ApacheMember),
                                                                                                                                [
                                                                                                                                    ts.factory.createReturnStatement(ts.factory.createStringLiteral("Apache.txt"))
                                                                                                                                ]),
                                                                                                                            ts.factory.createCaseClause(
                                                                                                                                ts.factory.createPropertyAccessExpression(
                                                                                                                                    ts.factory.createIdentifier(this.NamingContext.LicenseTypeEnumName),
                                                                                                                                    this.NamingContext.GPLMember),
                                                                                                                                []),
                                                                                                                            ts.factory.createDefaultClause(
                                                                                                                                [
                                                                                                                                    ts.factory.createReturnStatement(ts.factory.createStringLiteral("GPL.txt"))
                                                                                                                                ])
                                                                                                                        ]))
                                                                                                            ]))),
                                                                                                ts.factory.createPropertyAssignment(
                                                                                                    nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Destination),
                                                                                                    ts.factory.createStringLiteral("LICENSE"))
                                                                                            ],
                                                                                            true)
                                                                                    ],
                                                                                    true))
                                                                        ],
                                                                        true)
                                                                ],
                                                                true))
                                                    ],
                                                    true)
                                            ],
                                            true))
                                ],
                                true)))
                }
            ]);

        let methods = generatorClass.addMethods(
            [
                {
                    isAsync: true,
                    name: nameof<Generator>((generator) => generator.prompting),
                    returnType: printNode(
                        ts.factory.createTypeReferenceNode(
                            nameof(Promise),
                            [
                                ts.factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)
                            ])),
                    statements: [
                        printNode(
                            ts.factory.createExpressionStatement(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createThis(),
                                        nameof<Generator>((generator) => generator.log)),
                                    [],
                                    [
                                        ts.factory.createCallExpression(
                                            ts.factory.createIdentifier(this.NamingContext.YoSayName),
                                            [],
                                            [
                                                ts.factory.createTemplateExpression(
                                                    ts.factory.createTemplateHead("Welcome to the "),
                                                    [
                                                        ts.factory.createTemplateSpan(
                                                            ts.factory.createCallExpression(
                                                                ts.factory.createIdentifier(nameof(whiteBright)),
                                                                [],
                                                                [
                                                                    ts.factory.createStringLiteral(this.NamingContext.GeneratorDisplayName)
                                                                ]),
                                                            ts.factory.createTemplateTail(" generator!"))
                                                    ])
                                            ])
                                    ]))),
                        printNode(
                            ts.factory.createReturnStatement(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createSuper(),
                                        nameof<Generator>((generator) => generator.prompting)),
                                    [],
                                    [])))
                    ]
                },
                {
                    isAsync: true,
                    name: nameof<Generator>((generator) => generator.writing),
                    returnType: printNode(
                        ts.factory.createTypeReferenceNode(
                            nameof(Promise),
                            [
                                ts.factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)
                            ])),
                    statements: printNode(
                        ts.factory.createReturnStatement(
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createSuper(),
                                    nameof<Generator>((generator) => generator.writing)),
                                [],
                                [])))
                }
            ]);

        let logCall = this.WrapNode(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createThis(),
                    nameof<Generator>((generator) => generator.log)),
                [],
                []));

        logCall.addArgument(
            EOL +
            printNode(
                ts.factory.createCallExpression(
                    ts.factory.createIdentifier(this.NamingContext.DedentName),
                    [],
                    [
                        (
                            () =>
                            {
                                let indentation = " ".repeat(4 * 4);

                                return ts.factory.createTemplateExpression(
                                    ts.factory.createTemplateHead(`${EOL}${indentation}Your project is ready!${EOL}${EOL}${indentation}It lives in "`),
                                    [
                                        ts.factory.createTemplateSpan(
                                            ts.factory.createElementAccessExpression(
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createThis(),
                                                    nameof<Generator>((generator) => generator.Settings)),
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                                                    this.NamingContext.DestinationMember)),
                                            ts.factory.createTemplateTail('".'))
                                    ]);
                            })()
                    ])));

        methods.push(
            generatorClass.addMethod(
                {
                    isAsync: true,
                    name: nameof<Generator>((generator) => generator.end),
                    returnType: printNode(
                        ts.factory.createTypeReferenceNode(
                            nameof(Promise),
                            [
                                ts.factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)
                            ])),
                    statements: this.WrapExpression(logCall).getFullText()
                }));

        for (let member of [...getAccessors, ...methods])
        {
            member.addJsDocs(
                [
                    {
                        tags: [
                            {
                                leadingTrivia: EOL,
                                tagName: "inheritdoc"
                            }
                        ]
                    }
                ]);

            member.setScope(Scope.Public);
            member.toggleModifier("override", true);
        }

        for (
            let caseClause of [
                ...sourceFile.getDescendantsOfKind(SyntaxKind.CaseClause),
                ...sourceFile.getDescendantsOfKind(SyntaxKind.DefaultClause)
            ])
        {
            caseClause.getStatements()[0]?.prependWhitespace(EOL);
        }

        return sourceFile;
    }
}
