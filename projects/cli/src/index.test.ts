import { describe, it, expect } from 'bun:test';
import pkg from '../package.json' with { type: 'json' };

interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface CommandContract {
  name: string;
  validArgs: string[];
  expectedOutput: string;
  invalidArgs: string[];
  expectedError: string;
}

const commandContracts: CommandContract[] = [
  {
    name: 'greet',
    validArgs: ['greet', 'agent'],
    expectedOutput: 'hello, agent!',
    invalidArgs: ['greet', '--unknown-option'],
    expectedError: 'unknown-option'
  }
];

async function runCli(args: string[]): Promise<CliResult> {
  const proc = Bun.spawn(['bun', 'src/index.ts', ...args], {
    cwd: import.meta.dirname + '/..',
    stdout: 'pipe',
    stderr: 'pipe'
  });
  const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
  const exitCode = await proc.exited;
  return { stdout, stderr, exitCode };
}

describe('command contracts', () => {
  it('should cover every command shown in help', async () => {
    const { stdout, exitCode } = await runCli(['--help']);
    const commandNames = stdout
      .split('\n')
      .filter(line => /^\s+mycli \S/.test(line) && !line.includes('[default]'))
      .flatMap(line => {
        const name = line.trim().split(/\s+/)[1];
        return name ? [name] : [];
      });

    expect(exitCode).toBe(0);
    expect(Object.keys(pkg.bin)).toEqual(['mycli']);
    expect(commandNames).toEqual(commandContracts.map(({ name }) => name));
  });

  commandContracts.forEach(({ name, validArgs, expectedOutput, invalidArgs, expectedError }) => {
    it(`should run ${name} successfully`, async () => {
      const { stdout, exitCode } = await runCli(validArgs);
      expect(exitCode).toBe(0);
      expect(stdout.trim()).toBe(expectedOutput);
    });

    it(`should reject invalid ${name} options`, async () => {
      const { stderr, exitCode } = await runCli(invalidArgs);
      expect(exitCode).not.toBe(0);
      expect(stderr).toContain(expectedError);
    });
  });
});

describe('greet command', () => {
  it('should greet with default message', async () => {
    const { stdout, exitCode } = await runCli(['greet']);
    expect(stdout.trim()).toBe('hello, world!');
    expect(exitCode).toBe(0);
  });

  it('should greet with custom message', async () => {
    const { stdout, exitCode } = await runCli(['greet', 'bun']);
    expect(stdout.trim()).toBe('hello, bun!');
    expect(exitCode).toBe(0);
  });

  it('should capitalize with --capitalize flag', async () => {
    const { stdout, exitCode } = await runCli(['greet', 'bun', '--capitalize']);
    expect(stdout.trim()).toBe('hello, BUN!');
    expect(exitCode).toBe(0);
  });

  it('should capitalize with -c alias', async () => {
    const { stdout, exitCode } = await runCli(['greet', 'bun', '-c']);
    expect(stdout.trim()).toBe('hello, BUN!');
    expect(exitCode).toBe(0);
  });
});

describe('default command', () => {
  it('should show help when no command is given', async () => {
    const { stdout, exitCode } = await runCli([]);
    expect(stdout).toContain('greet');
    expect(stdout).toContain('<cmd>');
    expect(exitCode).toBe(0);
  });
});

describe('--help flag', () => {
  it('should print help and exit 0', async () => {
    const { stdout, exitCode } = await runCli(['--help']);
    expect(stdout).toContain('greet');
    expect(stdout).toContain('--help');
    expect(exitCode).toBe(0);
  });
});

describe('unknown command', () => {
  it('should exit non-zero and surface the offending argument on stderr', async () => {
    const { stderr, exitCode } = await runCli(['nonexistent']);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('nonexistent');
  });
});

describe('version', () => {
  it('should show version with --version', async () => {
    const { stdout, exitCode } = await runCli(['--version']);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    expect(exitCode).toBe(0);
  });
});
