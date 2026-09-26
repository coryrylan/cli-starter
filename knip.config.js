/** @type {import('knip').KnipConfig} */
export default {
  ignoreDependencies: [
    // Used in release.config.js plugins — knip's semantic-release plugin
    // resolves some plugin entries but misses these (and the dynamic
    // `preset: 'conventionalcommits'` string).
    '@nvidia-elements/code',
    '@nvidia-elements/core',
    '@nvidia-elements/styles',
    '@nvidia-elements/themes',
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    'conventional-changelog-conventionalcommits'
  ],
  workspaces: {
    'projects/cli': {
      // src/index.ts is auto-detected from package.json#bin.
      entry: ['src/**/*.test.ts', 'test/**/*.test.ts'],
      project: ['src/**/*.ts', 'test/**/*.ts']
    }
  }
};
