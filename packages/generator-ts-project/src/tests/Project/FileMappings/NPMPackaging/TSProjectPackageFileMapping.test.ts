import { ok, strictEqual } from "assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { PackageFileMappingTester } from "@manuth/generator-ts-project-test";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../../Core/Constants";
import { CommonDependencies } from "../../../../NPMPackaging/Dependencies/CommonDependencies";
import { LintDependencies } from "../../../../NPMPackaging/Dependencies/LintDependencies";
import { IScriptMapping } from "../../../../NPMPackaging/Scripts/IScriptMapping";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
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
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
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
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            await tester.AssertDependencies(new CommonDependencies());
                        });

                    test(
                        "Checking whether lint-dependencies are present if linting is enabled…",
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);

                            for (let lintingEnabled of [true, false])
                            {
                                await tester.Clean();
                                tester.Generator.Settings[GeneratorSettingKey.Components] = lintingEnabled ? [TSProjectComponent.Linting] : [];
                                await tester.Run();
                                await tester.AssertDependencies(new LintDependencies(), lintingEnabled);
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
                            let patchScriptName = "patchTypeScript";
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            await AssertScriptCopy("compile", "build");
                            await AssertScriptCopy("rebuild");

                            await tester.AssertScript(
                                "watch",
                                Constants.Package.Scripts.Get("watch-compile").replace("compile", "build"));

                            await tester.AssertScript("clean", Constants.Package.Scripts.Get("clean").replace("compile", "build"));
                            await AssertScriptCopy("lint-code-base", "lint-base");

                            await tester.AssertScript(
                                "lint",
                                Constants.Package.Scripts.Get("lint-code").replace("lint-code-base", "lint-base"));

                            await tester.AssertScript(
                                "lint-ide",
                                Constants.Package.Scripts.Get("lint-code-ide").replace("lint-code", "lint"));

                            await AssertScriptCopy("test");

                            await tester.AssertScript(
                                "prepare",
                                (script) =>
                                {
                                    return !script.includes(patchScriptName);
                                });

                            ok(!(await tester.ParseOutput()).Scripts.Has(patchScriptName));
                        });
                });
        });
}
