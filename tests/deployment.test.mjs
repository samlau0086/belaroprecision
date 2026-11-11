import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import yaml from 'js-yaml';

const workflow = yaml.load(readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8'));
const validationStep = workflow.jobs.deploy.steps.find(step => step.name === '校验部署配置');
const validationCode = validationStep.run.match(/<<'NODE'\n([\s\S]*?)\nNODE\n/)[1];
const lockPackages = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8')).packages;

test('Linux x64 和 ARM64 构建的原生依赖完整锁定，Sharp 包含 libvips', () => {
  const required = [
    ['node_modules/rollup', '@rollup/rollup-linux-x64-musl'],
    ['node_modules/rollup', '@rollup/rollup-linux-arm64-musl'],
    ['node_modules/esbuild', '@esbuild/linux-x64'],
    ['node_modules/esbuild', '@esbuild/linux-arm64'],
    ['node_modules/vite/node_modules/esbuild', '@esbuild/linux-x64'],
    ['node_modules/vite/node_modules/esbuild', '@esbuild/linux-arm64'],
    ...['linux-x64', 'linux-arm64', 'linuxmusl-x64', 'linuxmusl-arm64'].flatMap(target => [
      ['node_modules/sharp', `@img/sharp-${target}`],
      ['node_modules/sharp', `@img/sharp-libvips-${target}`],
    ]),
  ];
  for (const [parent, name] of required) {
    const version = lockPackages[parent].optionalDependencies[name];
    const candidates = [lockPackages[`${parent}/node_modules/${name}`], lockPackages[`node_modules/${name}`]];
    const entry = candidates.find(candidate => candidate?.version === version);
    assert.ok(entry, `${parent} 缺少 ${name}@${version} 的平台依赖记录`);
    assert.ok(entry.optional, `${name} 应为可选依赖`);
    assert.match(entry.integrity, /^sha512-/, `${name} 缺少包完整性校验`);
  }
});
const validEnvironment = {
  ...process.env,
  VPS_HOST: '203.0.113.10', VPS_USER: 'deploy', VPS_SSH_PORT: '22',
  VPS_SSH_KEY: '测试占位内容',
  DOCKER_PLATFORM: 'linux/amd64', HTTP_BIND_ADDRESS: '127.0.0.1', HTTP_PORT: '8080',
  PUBLIC_GRAPHQL_URL: 'https://cms.example.com/graphql',
};

function validate(changes = {}) {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', validationCode], {
    env: { ...validEnvironment, ...changes }, encoding: 'utf8',
  });
  if (result.error) throw result.error;
  return result;
}

test('部署配置允许正式后台、非默认 SSH 端口和 ARM 架构', () => {
  assert.equal(validate().status, 0);
  assert.equal(validate({ VPS_SSH_PORT: '2222', DOCKER_PLATFORM: 'linux/arm64', HTTP_BIND_ADDRESS: '0.0.0.0', HTTP_PORT: '28080' }).status, 0);
});

test('临时容器健康检查在首次连接重置后重试成功', { timeout: 20000 }, async (t) => {
  const buildStep = workflow.jobs.deploy.steps.find(step => step.name === '构建镜像与验证 HTTP 路由');
  const command = buildStep.run.split('\n').find(line => line.startsWith('curl ') && line.endsWith('/healthz'));
  assert.ok(command, '工作流必须先等待健康检查成功');
  let requests = 0;
  const server = createServer((request, response) => {
    requests += 1;
    if (requests === 1) {
      request.socket.resetAndDestroy();
      return;
    }
    response.end('ok');
  });
  t.after(() => new Promise(resolve => {
    server.close(resolve);
    server.closeAllConnections();
  }));
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const args = command.split(/\s+/).slice(1);
  args[args.length - 1] = `http://127.0.0.1:${server.address().port}/healthz`;
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? 'curl.exe' : 'curl', args, {
      env: { ...process.env, NO_PROXY: '127.0.0.1', no_proxy: '127.0.0.1' },
    });
    t.after(() => { if (child.exitCode === null) child.kill(); });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', status => resolve({ status, stdout, stderr }));
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(requests, 2, '首次连接重置后应再次请求健康端点');
  assert.equal(result.stdout, 'ok');
});

test('缺少 SSH 配置、本地后台、危险参数和无效端口会在连接前失败', () => {
  const invalidConfigurations = [
    { VPS_HOST: '' }, { VPS_USER: '' }, { VPS_SSH_KEY: '' },
    { PUBLIC_GRAPHQL_URL: '' }, { PUBLIC_GRAPHQL_URL: 'https://belaroprecision.local/graphql' },
    { PUBLIC_GRAPHQL_URL: 'http://cms.example.com/graphql' },
    { PUBLIC_GRAPHQL_URL: 'https://user:password@cms.example.com/graphql' },
    { PUBLIC_GRAPHQL_URL: 'https://localhost/graphql' },
    { VPS_HOST: 'host\nProxyCommand invalid' }, { VPS_USER: 'deploy; id' },
    { VPS_SSH_PORT: '0' }, { VPS_SSH_PORT: '65536' }, { HTTP_PORT: '8080; id' },
    { HTTP_BIND_ADDRESS: '$(id)' }, { DOCKER_PLATFORM: 'linux/invalid' },
  ];
  for (const configuration of invalidConfigurations) {
    assert.notEqual(validate(configuration).status, 0, `应拒绝：${Object.keys(configuration).join(', ')}`);
  }
});

test('工作流每个执行步骤和 VPS 部署脚本均符合 Bash 语法', () => {
  const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';
  const scripts = workflow.jobs.deploy.steps.filter(step => step.run).map(step => step.run);
  scripts.push(readFileSync(new URL('../deploy/deploy.sh', import.meta.url), 'utf8'));
  for (const script of scripts) {
    const result = spawnSync(bash, ['-n'], { input: script, encoding: 'utf8' });
    if (result.error) throw result.error;
    assert.equal(result.status, 0, result.stderr);
  }
});
