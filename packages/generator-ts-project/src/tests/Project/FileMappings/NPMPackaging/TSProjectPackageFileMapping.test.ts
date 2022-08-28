import { ok, strictEqual } from "assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../../Core/Constants";
import { TSConfigFileMapping } from "../../../../index";
import { CommonDependencies } from "../../../../NPMPackaging/Dependencies/CommonDependencies";
import { LintEssentials } from "../../../../NPMPackaging/Dependencies/LintEssentials";
import { IScriptMapping } from "../../../../NPMPackaging/Scripts/IScriptMapping";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackaging/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link TSProjectPackageFileMapping `TSProjectPackageFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The text-context.
 */
export function TSProjectPackageFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectPackageFileMapping),
        () =>
        {
            let fileMapping: TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>>;

            /**
             * Provides an implementation of the {@link TSProjectPackageFileMapping `TSProjectPackageFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTSProjectPackageFileMapping extends TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get ScriptMappings(): Array<IScriptMapping<ITSProjectSettings, GeneratorOptions> | string>
                {
                    return super.ScriptMappings;
                }

                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The loaded package.
                 */
                public override async LoadPackage(): Promise<Package>
                {
                    return super.LoadPackage();
                }
            }

            /**
             * Asserts that a script has been copied.
             *
             * @param source
             * The source of the script.
             *
             * @param destination
             * The destination of the script-.
             */
            async function AssertScriptCopy(source: string, destination?: string): Promise<void>
            {
                destination = destination ?? source;
                return tester.AssertScript(destination, Constants.Package.Scripts.Get(source));
            }

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    fileMapping = new TSProjectPackageFileMapping(await context.Generator);
                    tester = new PackageFileMappingTester(await context.Generator, fileMapping);
                });

            setup(
                async () =>
                {
                    return tester.Clean();
                });

            suite(
                nameof<TestTSProjectPackageFileMapping>((fileMapping) => fileMapping.LoadPackage),
                () =>
                {
                    test(
                        "Checking whether the name and the description are loaded from the prompts…",
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            let randomName = context.RandomString;
                            let randomDescription = context.RandomString;
                            tester.Generator.Settings[TSProjectSettingKey.Name] = randomName;
                            tester.Generator.Settings[TSProjectSettingKey.Description] = randomDescription;
                            await tester.Run();
                            strictEqual((await tester.ParseOutput()).Name, randomName);
                            strictEqual((await tester.ParseOutput()).Description, randomDescription);
                        });
                    test(
                        "Checking whether common dependencies are present…",
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            await tester.Run();
                            await tester.AssertDependencies(new CommonDependencies());
                        });

                    test(
                        "Checking whether lint-dependencies are present if linting is enabled…",
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);

                            for (let lintingEnabled of [true, false])
                            {
                                await tester.Clean();
                                tester.Generator.Settings[GeneratorSettingKey.Components] = lintingEnabled ? [TSProjectComponent.Linting] : [];
                                await tester.Run();
                                await tester.AssertDependencies(new LintEssentials(), lintingEnabled);
                            }
                        });
                });

            suite(
                nameof<TestTSProjectPackageFileMapping>((fileMapping) => fileMapping.ScriptMappings),
                () =>
                {
                    test(
                        "Checking whether all expected scripts are present…",
                        async function()
                        {
                            let patchScript = "patch-ts";
                            let rebuildScript = "rebuild";
                            let lintScript = "lint";
                            let lintCodeScript = "lint-code";
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await tester.Run();

                            await tester.AssertScript(
                                "build",
                                Constants.Package.Scripts.Get("build-base") + " " +
                                TSConfigFileMapping.GetFileName("build"));

                            await AssertScriptCopy(rebuildScript);
                            await AssertScriptCopy("watch");

                            await tester.AssertScript(
                                "clean",
                                Constants.Package.Scripts.Get("clean-base") + " ./lib");

                            await AssertScriptCopy(lintCodeScript, lintScript);

                            await tester.AssertScript(
                                "lint-ide",
                                Constants.Package.Scripts.Get("lint-code-ide").replace(
                                    lintCodeScript,
                                    lintScript));

                            await tester.AssertScript("test", (script) => !script.includes("tsd"));

                            await tester.AssertScript(
                                "prepare",
                                (script) =>
                                {
                                    return !script.includes(patchScript) &&
                                        script.includes(rebuildScript);
                                });

                            ok(!(await tester.ParseOutput()).Scripts.Has(patchScript));
                        });
                });
        });
}
