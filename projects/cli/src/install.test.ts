import { describe, expect, it } from 'bun:test';
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('install.sh', () => {
  it('should install into a home directory without .local/bin', async () => {
    const fixtureDir = await mkdtemp(join(tmpdir(), 'cli-starter-install-'));
    const homeDir = join(fixtureDir, 'home');
    const target = `mycli-${process.platform === 'darwin' ? 'macos' : 'linux'}-${process.arch}`;

    try {
      await mkdir(homeDir);
      await mkdir(join(fixtureDir, 'dist'));
      await copyFile(join(import.meta.dirname, '..', 'install.sh'), join(fixtureDir, 'install.sh'));
      await writeFile(join(fixtureDir, 'dist', target), '#!/bin/sh\necho installed\n');

      const proc = Bun.spawn(['bash', join(fixtureDir, 'install.sh')], {
        env: { ...process.env, HOME: homeDir },
        stdout: 'pipe',
        stderr: 'pipe'
      });
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited
      ]);

      expect(stderr).toBe('');
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Installing from local build');
      const installed = join(homeDir, '.local', 'bin', 'mycli');
      expect(await readFile(installed, 'utf8')).toBe('#!/bin/sh\necho installed\n');
      expect((await stat(installed)).mode & 0o111).not.toBe(0);
    } finally {
      await rm(fixtureDir, { recursive: true, force: true });
    }
  });

  it('should download a mycli asset from a cli-starter release', async () => {
    const fixtureDir = await mkdtemp(join(tmpdir(), 'cli-starter-download-'));
    const homeDir = join(fixtureDir, 'home');
    const binDir = join(fixtureDir, 'bin');
    const requestLog = join(fixtureDir, 'requests');
    const target = `mycli-${process.platform === 'darwin' ? 'macos' : 'linux'}-${process.arch}`;

    try {
      await mkdir(homeDir);
      await mkdir(binDir);
      await copyFile(join(import.meta.dirname, '..', 'install.sh'), join(fixtureDir, 'install.sh'));
      await writeFile(
        join(binDir, 'curl'),
        `#!/bin/sh
printf '%s\\n' "$*" >> "$REQUEST_LOG"
if [ "$#" -eq 2 ]; then
  printf '%s\\n' '{"tag_name": "cli-starter-v1.2.3"}'
else
  printf '#!/bin/sh\\necho downloaded\\n' > "$4"
fi
`,
        { mode: 0o755 }
      );

      const proc = Bun.spawn(['bash', join(fixtureDir, 'install.sh')], {
        env: {
          ...process.env,
          HOME: homeDir,
          PATH: `${binDir}:${process.env.PATH ?? ''}`,
          REQUEST_LOG: requestLog,
          TMPDIR: fixtureDir
        },
        stdout: 'pipe',
        stderr: 'pipe'
      });
      const [stderr, exitCode] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);

      expect(stderr).toBe('');
      expect(exitCode).toBe(0);
      expect(await readFile(join(homeDir, '.local', 'bin', 'mycli'), 'utf8')).toBe('#!/bin/sh\necho downloaded\n');
      expect(await readFile(requestLog, 'utf8')).toContain(
        `https://github.com/coryrylan/cli-starter/releases/download/cli-starter-v1.2.3/${target}`
      );
    } finally {
      await rm(fixtureDir, { recursive: true, force: true });
    }
  });
});
