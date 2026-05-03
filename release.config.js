import fs from 'node:fs';

const DRY_RUN = false;
const packageFile = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`));
const scope = packageFile.name.includes('/')
  ? packageFile.name.split('/')[1]
  : packageFile.name === 'cli-starter'
    ? 'cli'
    : packageFile.name;

export default {
  dryRun: DRY_RUN,
  tagFormat: `${packageFile.name}-v\${version}`,
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: false },
          { type: 'feat', release: false },
          { type: 'fix', release: false },
          { type: 'chore', release: false },
          { breaking: true, scope, release: 'major' },
          { type: 'feat', scope, release: 'minor' },
          { type: 'fix', scope, release: 'patch' }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          ignoreCommits: `^(?![^]*\\(${scope}\\))(?![^]*\\[${scope}\\]).*$`
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'bun pm pkg set version=${nextRelease.version} && bun pm pack',
        publishCmd: `npm publish ./*.tgz --provenance --registry=https://registry.npmjs.org ${DRY_RUN ? '--dry-run' : ''} --access=public`
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: `chore(release): ${packageFile.name}` + '-v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/github',
      {
        success: '🎉 This issue has been resolved in version ${nextRelease.version} 🎉',
        assets: [
          { label: 'linux-arm64', path: 'dist/cli-starter-linux-arm64' },
          { label: 'linux-x64', path: 'dist/cli-starter-linux-x64' },
          { label: 'macos-arm64', path: 'dist/cli-starter-macos-arm64' },
          { label: 'macos-x64', path: 'dist/cli-starter-macos-x64' },
          { label: 'windows-x64', path: 'dist/cli-starter-windows-x64.exe' }
        ]
      }
    ]
  ]
};
