import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should write a cache file', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-cache',
      {
        '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
'regexp no hack comments': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
    `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const cachePath = resolve('./.betterer.cache');

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath, cache: true, cachePath });

    expect(runNames(newTestRun.new)).toEqual(['regexp no hack comments']);

    const cache = await readFile(cachePath);

    expect(cache).toMatchSnapshot();

    const sameTestRun = await betterer({ configPaths, resultsPath, cache: true, cachePath });

    expect(runNames(sameTestRun.same)).toEqual(['regexp no hack comments']);

    await writeFile(indexPath, `// HACK:\n// HACK:`);

    const worseTestRun = await betterer({ configPaths, resultsPath, cache: true, cachePath });

    expect(runNames(worseTestRun.worse)).toEqual(['regexp no hack comments']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath, cache: true, cachePath });

    expect(runNames(betterTestRun.better)).toEqual(['regexp no hack comments']);

    const completedTestRun = await betterer({ configPaths, resultsPath, cache: true, cachePath });

    expect(runNames(completedTestRun.completed)).toEqual(['regexp no hack comments']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
