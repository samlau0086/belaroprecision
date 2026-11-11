import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const workflow = yaml.load(readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8'));
const validationStep = workflow.jobs.deploy.steps.find(step => step.name === '校验部署配置');
const validationCode = validationStep.run.match(/<<'NODE'\n([\s\S]*?)\nNODE\n/)[1];
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
  assert.equal(validate({ VPS_SSH_PORT: '2222', DOCKER_PLATFORM: 'linux/arm64', HTTP_BIND_ADDRESS: '0.0.0.0' }).status, 0);
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
