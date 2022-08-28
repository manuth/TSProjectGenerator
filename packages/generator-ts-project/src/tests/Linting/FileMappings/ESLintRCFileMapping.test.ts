import { doesNotReject, ok, strictEqual } from "assert";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { PluginName, PresetName } from "@manuth/eslint-plugin-typescript";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { JavaScriptFileMappingTester } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { Linter } from "eslint";
import npmWhich from "npm-which";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping.js";
import { LintRuleset } from "../../../Linting/LintRuleset.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectComponent } from "../../../Project/Settings/TSProjectComponent.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the  {@link ESLintRCFileMapping `ESLintRCFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function ESLintRCFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(ESLintRCFileMapping),
        () =>
        {
            let tempDir: TempDirectory;
            let generator: TSProjectGenerator;
            let settings: Partial<ITSProjectSettings>;
            let fileMapping: ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: JavaScriptFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(7.5 * 60 * 1000);
                    tempDir = new TempDirectory();

                    settings = {
                        [GeneratorSettingKey.Components]: [
                            TSProjectComponent.Linting
                        ]
                    };

                    let generatorContext = context.ExecuteGenerator();
                    generatorContext.inDir(tempDir.FullName);
                    await generatorContext;
                    generator = generatorContext.generator;

                    let installationResult = spawnSync(
                        npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    strictEqual(installationResult.status, 0);
                    fileMapping = new ESLintRCFileMapping(generator);
                    tester = new JavaScriptFileMappingTester(generator, fileMapping);
                });

            suiteTeardown(
                function()
                {
                    this.timeout(10 * 1000);
                    tempDir.Dispose();
                });

            setup(
                () =>
                {
                    Object.assign(tester.Generator.Settings, settings);
                });

            suite(
                nameof(ESLintRCFileMapping.FileName),
                () =>
                {
                    test(
                        "Checking whether the proper file-name is returned…",
                        () =>
                        {
                            strictEqual(ESLintRCFileMapping.FileName, ".eslintrc.js");
                        });
                });

            suite(
                nameof<ESLintRCFileMapping<any, any>>((fileMapping) => fileMapping.DefaultBaseName),
                () =>
                {
                    test(
                        `Checking whether the default base-name equals \`${nameof(ESLintRCFileMapping)}.${nameof(ESLintRCFileMapping.FileName)}\`…`,
                        () =>
                        {
                            strictEqual(fileMapping.DefaultBaseName, ESLintRCFileMapping.FileName);
                        });
                });

            suite(
                nameof<ESLintRCFileMapping<any, any>>((fileMapping) => fileMapping.BaseName),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<ESLintRCFileMapping<any, any>>((fm) => fm.BaseName)}\` equals the \`${nameof<ESLintRCFileMapping<any, any>>((fm) => fm.DefaultBaseName)}\`…`,
                        () =>
                        {
                            strictEqual(fileMapping.BaseName, fileMapping.DefaultBaseName);
                        });
                });

            suite(
                nameof<ESLintRCFileMapping<any, any>>((fileMapping) => fileMapping.Processor),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<Linter.Config>((config) => config.root)}\` property is not present…`,
                        async function()
                        {
                            this.timeout(15 * 1000);
                            this.slow(7.5 * 1000);
                            await tester.Run();
                            ok(!(nameof<Linter.Config>((config) => config.root) in await tester.Require()));
                        });

                    test(
                        `Checking whether the \`${nameof<Linter.Config>((config) => config.ignorePatterns)}\` property is not present…`,
                        async function()
                        {
                            this.timeout(15 * 1000);
                            this.slow(7.5 * 1000);
                            await tester.Run();
                            ok(!(nameof<Linter.Config>((config) => config.ignorePatterns) in await tester.Require()));
                        });

                    test(
                        `Checking whether the \`${nameof<Linter.Config>((config) => config.extends)}\`-property of the eslint-config is applied correctly…`,
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);

                            for (let ruleset of [LintRuleset.Weak, LintRuleset.Recommended])
                            {
                                let eslintConfig: any;
                                let configName: string;
                                let baseConfigs: string[];
                                tester.Generator.Settings[TSProjectSettingKey.LintRuleset] = ruleset;
                                await tester.Run();
                                await doesNotReject(async () => eslintConfig = await tester.Require());
                                baseConfigs = eslintConfig.extends;

                                switch (ruleset)
                                {
                                    case LintRuleset.Weak:
                                        configName = PresetName.WeakWithTypeChecking;
                                        break;
                                    case LintRuleset.Recommended:
                                    default:
                                        configName = PresetName.RecommendedWithTypeChecking;
                                        break;
                                }

                                ok(
                                    baseConfigs.some(
                                        (baseConfig) =>
                                        {
                                            return baseConfig === `plugin:${PluginName}/${configName}`;
                                        }));
                            }
                        });
                });
        });
}
