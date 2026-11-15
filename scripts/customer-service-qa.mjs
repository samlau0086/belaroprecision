import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const qaSource = new URL('../docs/customer-service/qa.json', import.meta.url);
export const qaMarkdown = new URL('../docs/customer-service/qa.md', import.meta.url);

export function renderQa(data) {
  const sections = data.items.map(item => [
    `## ${item.id} ${item.question}`,
    '',
    `分类：${item.category}`,
    '',
    `相似问法：${item.variants.join('；')}`,
    '',
    `回答：${item.answer}`,
    '',
    `来源：${item.source_paths.map(path => `https://belaroprecision.com${path}`).join(' 、')}`,
    '',
    `需人工确认或执行：${item.handoff_required ? '是；不代表已转接或已执行。' : '否；具体项目承诺仍按评审结果。'}`,
  ].join('\n'));

  return [
    '# Belaro Precision 客服常见问答',
    '',
    `版本：${data.version}；整理日期：${data.updated_at}；共 ${data.items.length} 条。`,
    '',
    data.scope,
    '',
    '本文件由 qa.json 生成，请修改主数据后运行 node scripts/customer-service-qa.mjs。回答以中文维护，客服应跟随访客语言忠实翻译，并保留所有条件与限制。',
    '',
    ...sections.flatMap(section => [section, '']),
  ].join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('仅支持 --check 参数。');
  const data = JSON.parse(await readFile(qaSource, 'utf8'));
  const output = renderQa(data);
  if (args.includes('--check')) {
    if (await readFile(qaMarkdown, 'utf8') !== output) {
      throw new Error('qa.md 与 qa.json 不同步，请运行 node scripts/customer-service-qa.mjs。');
    }
    console.log(`知识库检查通过：${data.items.length} 条 QA，Markdown 与 JSON 同步。`);
    return;
  }
  await writeFile(qaMarkdown, output, 'utf8');
  console.log(`已生成 ${data.items.length} 条问答：docs/customer-service/qa.md`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
