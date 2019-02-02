import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getAllModes, replaceStylePlaceholders } from '../app-core/register-app-styles';
import { optimizeAppCoreBundle } from '../app-core/optimize-app-core';
import { sys } from '@sys';


export function writeNativeSelfContained(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, outputTargets: d.OutputTargetWebComponent[], cmps: d.ComponentCompilerMeta[], outputText: string) {
  const allModes = getAllModes(cmps);

  return Promise.all(allModes.map(async modeName => {
    const modeOutputText = await writeNativeSelfContainedMode(config, compilerCtx, buildCtx, build, cmps, modeName, outputText);

    return Promise.all(cmps.map(cmp => {
      return Promise.all(outputTargets.map(outputTarget => {
        return writeNativeSelfContainedModeOutput(compilerCtx, outputTarget, cmp, modeOutputText, modeName);
      }));
    }));
  }));
}


async function writeNativeSelfContainedMode(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[], modeName: string, code: string) {
  code = replaceStylePlaceholders(cmps, modeName, code);

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, code);
  buildCtx.diagnostics.push(...results.diagnostics);

  if (results.diagnostics.length === 0 && typeof results.output === 'string') {
    code = results.output;
  }

  return code;
}


function writeNativeSelfContainedModeOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWebComponent, cmpMeta: d.ComponentCompilerMeta, modeOutputText: string, modeName: string) {
  let fileName = `${cmpMeta.tagName}`;
  if (modeName !== DEFAULT_STYLE_MODE) {
    fileName += `.${modeName}`;
  }
  fileName += `.js`;

  const filePath = sys.path.join(outputTarget.dir, fileName);

  return compilerCtx.fs.writeFile(filePath, modeOutputText);
}
