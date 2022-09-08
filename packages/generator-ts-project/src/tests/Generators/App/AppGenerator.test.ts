import { doesNotReject, ok } from "node:assert";
import { IRunContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { PromptModule } from "inquirer";
import { createSandbox, SinonExpectation, SinonSandbox } from "sinon";
import yeomanTest from "yeoman-test";
import { AppGenerator } from "../../../generators/app/AppGenerator.js";
import { ProjectType } from "../../../generators/app/ProjectType.js";
import { ProjectSelectorSettingKey } from "../../../generators/app/Settings/ProjectSelectorSettingKey.js";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator.js";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
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
            let sandbox: SinonSandbox;
            let workingDirectory: string;
            let tempDir: TempDirectory;
            let contextCreator: () => IRunContext<AppGenerator>;
            let tardownActions: Array<() => void>;

            suiteSetup(
                async () =>
                {
                    tardownActions = [];

                    contextCreator = () =>
                    {
                        let result = context.ExecuteGenerator();
                        tardownActions.push(() => result.removeAllListeners());

                        result.on(
                            "ready",
                            () =>
                            {
                                let mockedPrompt = sandbox.mock(result.generator.env.adapter.promptModule);

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
                                        register = register.bind(result.generator.env.adapter.promptModule);
                                        register(...args);
                                        mockedPrompt.restore();
                                        mockPrompt(result.generator, result.answers);
                                        AddFake();
                                    };
                                }

                                AddFake();
                            });

                        return result;
                    };
                });

            setup(
                function()
                {
                    this.timeout(0.5 * 60 * 1000);
                    sandbox = createSandbox();
                    workingDirectory = process.cwd();
                    tempDir = new TempDirectory();

                    let prototype = TSProjectGenerator.prototype;
                    sandbox.replace(prototype, "cleanup", async () => { });
                    sandbox.replace(prototype, "end", async () => { });
                    sandbox.replace(prototype, "initializing", async () => { });
                    sandbox.replace(prototype, "install", async () => { });
                    sandbox.replace(prototype, "prompting", async () => { });
                    sandbox.replace(prototype, "writing", async () => { });
                });

            teardown(
                function()
                {
                    this.timeout(45 * 1000);
                    sandbox.restore();
                    tardownActions.forEach((action) => action());
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
                            await doesNotReject(async () => contextCreator().inDir(tempDir.FullName).toPromise());
                        });

                    test(
                        `Checking whether the \`${nameof(TSModuleGenerator)}\` can be executed…`,
                        async function()
                        {
                            this.timeout(15 * 1000);
                            this.slow(7.5 * 1000);
                            let moduleGeneratorRan: boolean;

                            sandbox.replace(
                                TSModuleGenerator.prototype,
                                "end",
                                async () =>
                                {
                                    moduleGeneratorRan = true;
                                });

                            await doesNotReject(
                                () =>
                                {
                                    return contextCreator().withPrompts(
                                        {
                                            [ProjectSelectorSettingKey.ProjectType]: ProjectType.Module
                                        }).inDir(tempDir.FullName).toPromise();
                                });

                            ok(moduleGeneratorRan);
                        });

                    test(
                        `Checking whether the \`${nameof(TSGeneratorGenerator)}\` can be executed…`,
                        async function()
                        {
                            this.timeout(15 * 1000);
                            this.slow(7.5 * 1000);
                            let generatorGeneratorRan: boolean;

                            sandbox.replace(
                                TSGeneratorGenerator.prototype,
                                "end",
                                async () =>
                                {
                                    generatorGeneratorRan = true;
                                });

                            await doesNotReject(
                                async () =>
                                {
                                    return contextCreator().withPrompts(
                                        {
                                            [ProjectSelectorSettingKey.ProjectType]: ProjectType.Generator
                                        }).inDir(tempDir.FullName).toPromise();
                                });

                            ok(generatorGeneratorRan);
                        });
                });
        });
}
