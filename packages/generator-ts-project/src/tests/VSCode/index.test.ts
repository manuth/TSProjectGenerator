import { basename } from "path";
import { ComponentTests } from "./Components/index.test.js";
import { ExtensionsProcessorTests } from "./ExtensionsProcessor.test.js";
import { FileMappingTests } from "./FileMappings/index.test.js";
import { LaunchSettingsProcessorTests } from "./LaunchSettingsProcessor.test.js";
import { SettingsProcessorTest } from "./SettingsProcessor.test.js";
import { TasksProcessorTests } from "./TasksProcessor.test.js";
import { VSCodeJSONProcessorTests } from "./VSCodeJSONProcessor.test.js";
import { WorkspaceProcessorTests } from "./WorkspaceProcessor.test.js";

/**
 * Registers tests for `VSCode` components.
 */
export function VSCodeTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            VSCodeJSONProcessorTests();
            ExtensionsProcessorTests();
            LaunchSettingsProcessorTests();
            SettingsProcessorTest();
            TasksProcessorTests();
            WorkspaceProcessorTests();
            FileMappingTests();
            ComponentTests();
        });
}
