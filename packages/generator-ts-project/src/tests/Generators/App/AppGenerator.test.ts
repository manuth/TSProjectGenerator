import { doesNotReject, doesNotThrow } from "node:assert";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { IRunContext, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { PromptModule } from "inquirer";
import npmWhich from "npm-which";
import { createSandbox, SinonExpectation, SinonSandbox } from "sinon";
import yeomanTest from "yeoman-test";
import { GeneratorName } from "../../../Core/GeneratorName.js";
import { AppGenerator } from "../../../generators/app/AppGenerator.js";
import { ProjectType } from "../../../generators/app/ProjectType.js";
import { ProjectSelectorSettingKey } from "../../../generators/app/Settings/ProjectSelectorSettingKey.js";
import { TestContext } from "../../TestContext.js";

const { mockPrompt } = yeomanTest;

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppGeneratorTests(context: TestContext<AppGenerator>): void
{
    suite(
        nameof(AppGenerator),
        () =>
        {
            let npmPath: string;
            let sandbox: SinonSandbox;
            let workingDirectory: string;
            let tempDir: TempDirectory;
            let generatorContext: IRunContext<AppGenerator>;

            suiteSetup(
                () =>
                {
                    npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");
                });

            setup(
                () =>
                {
                    sandbox = createSandbox();
                    workingDirectory = process.cwd();
                    tempDir = new TempDirectory();
                    generatorContext = context.ExecuteGenerator();

                    generatorContext.on(
                        "ready",
                        () =>
                        {
                            let mockedPrompt = sandbox.mock(generatorContext.generator.env.adapter.promptModule);

                            /**
                             * Adds the fake prompt-registration to the prompt-module.
                             */
                            function AddFake(): void
                            {
                                let mockedRegister = mockedPrompt.expects(nameof<PromptModule>((m) => m.registerPrompt));
                                mockedRegister.atLeast(0);
                                mockedRegister.callsFake(GetFakeRegisterPrompt(mockedRegister));
                            }

                            /**
                             * Fakes the registration of a prompt.
                             *
                             * @param expectation
                             * The {@link SinonExpectation `SinonExpectation`} to add the faked prompt-registration to.
                             *
                             * @returns
                             * A method for faking the prompt-registration.
                             */
                            function GetFakeRegisterPrompt(expectation: SinonExpectation): (...args: any[]) => void
                            {
                                return (...args: any[]): void =>
                                {
                                    let register = expectation.wrappedMethod;
                                    register = register.bind(generatorContext.generator.env.adapter.promptModule);
                                    register(...args);
                                    mockedPrompt.restore();
                                    mockPrompt(generatorContext.generator, generatorContext.answers);
                                    AddFake();
                                };
                            }

                            AddFake();
                        });
                });

            teardown(
                function()
                {
                    this.timeout(45 * 1000);
                    sandbox.restore();
                    generatorContext.removeAllListeners();
                    process.chdir(workingDirectory);
                    tempDir.Dispose();
                });

            suite(
                nameof<AppGenerator>((generator) => generator.projectTypeSelection),
                () =>
                {
                    test(
                        "Checking whether the generator can be executed…",
                        async function()
                        {
                            this.timeout(6 * 60 * 1000);
                            this.slow(3 * 60 * 1000);
                            await doesNotReject(async () => generatorContext.inDir(tempDir.FullName).toPromise());
                        });

                    test(
                        "Checking whether modules can be generated…",
                        async function()
                        {
                            this.timeout(15 * 60 * 1000);
                            this.slow(7.5 * 60 * 1000);

                            await doesNotReject(
                                () =>
                                {
                                    return generatorContext.withPrompts(
                                        {
                                            [ProjectSelectorSettingKey.ProjectType]: ProjectType.Module
                                        }).inDir(tempDir.FullName).toPromise();
                                });

                            spawnSync(
                                npmPath,
                                [
                                    "install",
                                    "--silent"
                                ],
                                {
                                    cwd: tempDir.FullName,
                                    stdio: "ignore"
                                });

                            spawnSync(
                                npmPath,
                                [
                                    "run",
                                    "build"
                                ],
                                {
                                    cwd: tempDir.FullName,
                                    stdio: "ignore"
                                });

                            doesNotThrow(
                                () =>
                                {
                                    createRequire(import.meta.url)(tempDir.FullName);
                                });
                        });

                    test(
                        "Checking whether generators can be generated…",
                        async function()
                        {
                            this.timeout(20 * 60 * 1000);
                            this.slow(10 * 60 * 1000);
                            let subGeneratorDir = new TempDirectory();

                            await doesNotReject(
                                async () =>
                                {
                                    return generatorContext.withPrompts(
                                        {
                                            [ProjectSelectorSettingKey.ProjectType]: ProjectType.Generator
                                        }).inDir(tempDir.FullName).toPromise();
                                });

                            spawnSync(
                                npmPath,
                                [
                                    "install",
                                    "--silent"
                                ],
                                {
                                    cwd: tempDir.FullName,
                                    stdio: "ignore"
                                });

                            spawnSync(
                                npmPath,
                                [
                                    "run",
                                    "build"
                                ],
                                {
                                    cwd: tempDir.FullName,
                                    stdio: "ignore"
                                });

                            await doesNotReject(
                                async () =>
                                {
                                    return new GeneratorContext(
                                        tempDir.MakePath("lib", "generators", GeneratorName.Main)).ExecuteGenerator().inDir(
                                            subGeneratorDir.FullName).toPromise();
                                });
                        });
                });
        });
}
