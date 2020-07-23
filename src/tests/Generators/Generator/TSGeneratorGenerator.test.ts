import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";

/**
 * Joins the specified `path` relative to the generator-directory.
 *
 * @param generator
 * The generator that created the generator-directory.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The joined path.
 */
export function GeneratorPath(generator: TSGeneratorGenerator, ...path: string[]): string
{
    return generator.destinationPath("lib", "generators", ...path);
}
