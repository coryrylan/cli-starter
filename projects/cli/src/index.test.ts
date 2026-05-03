import { describe, it, expect } from 'bun:test';

function runCli(args: string[]): Promise<string> {
  const proc = Bun.spawn(['bun', 'src/index.ts', ...args], {
    cwd: import.meta.dirname + '/..',
    stdout: 'pipe',
    stderr: 'pipe'
  });
  return new Response(proc.stdout).text();
}

describe('greet command', () => {
  it('should greet with default message', async () => {
    const output = await runCli(['greet']);
    expect(output.trim()).toBe('hello, world!');
  });

  it('should greet with custom message', async () => {
    const output = await runCli(['greet', 'bun']);
    expect(output.trim()).toBe('hello, bun!');
  });

  it('should capitalize with --capitalize flag', async () => {
    const output = await runCli(['greet', 'bun', '--capitalize']);
    expect(output.trim()).toBe('hello, BUN!');
  });

  it('should capitalize with -c alias', async () => {
    const output = await runCli(['greet', 'bun', '-c']);
    expect(output.trim()).toBe('hello, BUN!');
  });
});

describe('default command', () => {
  it('should show help when no command is given', async () => {
    const output = await runCli([]);
    expect(output).toContain('greet');
    expect(output).toContain('<cmd>');
  });
});

describe('version', () => {
  it('should show version with --version', async () => {
    const output = await runCli(['--version']);
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
