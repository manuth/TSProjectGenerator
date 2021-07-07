import { doesNotReject, ok } from "assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { JavaScriptFileMappingTester } from "@manuth/extended-yo-generator-test";
import { Linter } from "eslint";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping";
import { LintRuleset } from "../../../Linting/LintRuleset";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

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
            let settings: Partial<ITSProjectSettings>;
            let fileMapping: ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: JavaScriptFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    settings = {
                        [GeneratorSettingKey.Components]: [
                            TSProjectComponent.Linting
                        ]
                    };

                    fileMapping = new ESLintRCFileMapping(await context.Generator);
                    tester = new JavaScriptFileMappingTester(await context.Generator, fileMapping);
                });

            setup(
                () =>
                {
                    Object.assign(tester.Generator.Settings, settings);
                });

            suite(
                nameof<ESLintRCFileMapping<any, any>>((fileMapping) => fileMapping.Processor),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<Linter.Config>((config) => config.root)}\` property is not present…`,
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            ok(!(nameof<Linter.Config>((config) => config.root) in await tester.Require()));
                        });

                    test(
                        `Checking whether the \`${nameof<Linter.Config>((config) => config.extends)}\`-property of the eslint-config is applied correctly…`,
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);

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
                                        configName = "weak";
                                        break;
                                    case LintRuleset.Recommended:
                                    default:
                                        configName = "recommended";
                                        break;
                                }

                                ok(
                                    baseConfigs.some(
                                        (baseConfig) =>
                                        {
                                            return baseConfig.includes(configName);
                                        }));
                            }
                        });
                });
        });
}
