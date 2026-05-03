/** @type {import('knip').KnipConfig} */
export default {
  ignoreDependencies: [
    // Used in release.config.js plugins — knip's semantic-release plugin
    // resolves some plugin entries but misses these (and the dynamic
    // `preset: 'conventionalcommits'` string).
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    'conventional-changelog-conventionalcommits'
  ],
  workspaces: {
    'projects/cli': {
      // src/index.ts is auto-detected from package.json#bin.
      entry: ['src/**/*.test.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // Pre-installed for future features (see projects/cli/CLAUDE.md
        // "Pre-installed but unused deps"). Drop from this list once wired into src/.
        '@modelcontextprotocol/sdk',
        'marked',
        'marked-terminal',
        '@types/marked-terminal',
        'zod'
      ]
    }
  }
};
