import Assert = require("assert");
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { JavaScriptFileMappingTester } from "@manuth/extended-yo-generator-test";
import { ESLintRCFileMapping } from "../../../Linting/FileMappings/ESLintRCFileMapping";
import { LintRuleset } from "../../../Linting/LintRuleset";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the  `ESLintRCFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function ESLintRCFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "ESLintRCFileMapping",
        () =>
        {
            let settings: Partial<ITSProjectSettings>;
            let fileMapping: ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: JavaScriptFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, ESLintRCFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
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

            test(
                "Checking whether the `root` property is not present…",
                async () =>
                {
                    await tester.Run();
                    Assert.ok(!("root" in await tester.Require()));
                });

            test(
                "Checking whether the eslint config base is applied correctly…",
                async () =>
                {
                    for (let ruleset of [LintRuleset.Weak, LintRuleset.Recommended])
                    {
                        let eslintConfig: any;
                        let configName: string;
                        let baseConfigs: string[];
                        tester.Generator.Settings[TSProjectSettingKey.LintRuleset] = ruleset;
                        await tester.Run();
                        await Assert.doesNotReject(async () => eslintConfig = await tester.Require());
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

                        Assert.ok(
                            baseConfigs.some(
                                (baseConfig) =>
                                {
                                    return baseConfig.includes(configName);
                                }));
                    }
                });
        });
}
