import { ok, strictEqual } from "assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Constants } from "../../../../Core/Constants";
import { CommonDependencies } from "../../../../NPMPackaging/Dependencies/CommonDependencies";
import { LintDependencies } from "../../../../NPMPackaging/Dependencies/LintDependencies";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { PackageFileMappingTester } from "../../../NPMPackaging/FileMappings/PackageFileMappingTester";
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
        "TSProjectPackageFileMapping",
        () =>
        {
            let fileMapping: TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: PackageFileMappingTester<TSProjectGenerator, ITSProjectSettings, GeneratorOptions, TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>>;

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
                return AssertScript(destination, Constants.Package.Scripts.Get(source));
            }

            /**
             * Asserts the contents of a script.
             *
             * @param name
             * The name of the script.
             *
             * @param content
             * The expected contents of the script.
             */
            async function AssertScript(name: string, content: string): Promise<void>
            {
                strictEqual((await tester.Package).Scripts.Get(name), content);
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
                "General",
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
                            strictEqual((await tester.Package).Name, randomName);
                            strictEqual((await tester.Package).Description, randomDescription);
                        });
                });

            suite(
                "Scripts",
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

                            await AssertScript(
                                "watch",
                                Constants.Package.Scripts.Get("watch-compile").replace("compile", "build"));

                            await AssertScript("clean", Constants.Package.Scripts.Get("clean").replace("compile", "build"));
                            await AssertScriptCopy("lint-code-base", "lint-base");

                            await AssertScript(
                                "lint",
                                Constants.Package.Scripts.Get("lint-code").replace("lint-code-base", "lint-base"));

                            await AssertScript(
                                "lint-ide",
                                Constants.Package.Scripts.Get("lint-code-ide").replace("lint-code", "lint"));

                            await AssertScriptCopy("test");
                            let scripts = (await tester.Package).Scripts;
                            console.log(scripts);
                            ok(!(await tester.Package).Scripts.Get("prepare").includes(patchScriptName));
                            ok(!scripts.Has(patchScriptName));
                        });
                });

            suite(
                "Dependencies",
                () =>
                {
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
        });
}
