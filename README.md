# typedoc-plugin-sort-enum

TypeDoc plugin to sort enum members by their values.

注意：该做法不能影响到文档生成的顺序，暂时归档！！！
注意：该做法不能影响到文档生成的顺序，暂时归档！！！
注意：该做法不能影响到文档生成的顺序，暂时归档！！！

可以用 `sort` 配置项来实现该需求，参考 [文档：Sort](https://typedoc.org/documents/Options.Organization.html#sort)

typedoc.json:

```json
{
  ...
  "sort":
  [
    "kind",
    "instance-first",
    "enum-value-ascending", // add this line
    "alphabetical-ignoring-documents"
  ],
}
```

## Installation

```bash
npm install typedoc-plugin-sort-enum --save-dev
```

## Usage

1.在 `typedoc.json` 中添加插件：

```json
{
  "entryPoints": ["./src/index.ts"],
  "out": "docs",
  "plugin": ["typedoc-plugin-sort-enum"] // 添加插件
}
```

2.可选 `typedoc.json` 配置排序策略（默认按值排序 `"value"`）：

```json
{
  "sortEnumStrategy": "value" // 或 "key"
}
```

## 功能特性

- ✅ 支持数值/字符串枚举混合排序
- ✅ 数字值优先排序（如 `1, 2, "hello"`）
- ✅ 提供可配置策略（按 KEY 或 VALUE 排序）
- ✅ 兼容 TypeDoc 0.24+ 和 ESM 项目

### 实际效果预览

Before:

```js
enum Status {
  Draft = 0,
  Published = 1,
  Archived = 2
}
// 文档显示顺序：Archived, Draft, Published（按 KEY 字母排序）
```

After:

```js
// 文档显示顺序：Draft (0), Published (1), Archived (2)
```

## 开发

```bash
npm run build
```

测试插件

```bash
typedoc --plugin ./dist/index.js --entryPoints your-entry-file.ts
```

### 开发环境

- TypeScript 5.0+
- Node.js 18+
- TypeDoc 0.24.8
- macOS/Linux/Windows WSL2

### 项目结构

```bash
typedoc-plugin-sort-enum/
├── dist/                    # 构建产物
│   ├── index.js
│   └── index.d.ts
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```
