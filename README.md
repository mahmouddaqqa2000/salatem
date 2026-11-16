# Salatem | سلاتم

ثيم لمتاجر سلة مبني على قالب رائد الرسمي `@salla.sa/theme-raed@1.0.64` باستخدام React وTwilight.

## المعاينة المحلية

يتطلب المشروع Node.js 22.22.2+ أو 24.15.0+ أو 26+، وpnpm 10 أو أحدث.

```bash
pnpm install --frozen-lockfile
npm install -g @salla.sa/cli
salla theme dev
```

افتح مسار `/ar` للواجهة العربية أو `/en` للواجهة الإنجليزية على العنوان الذي تعرضه الأداة.
تستخدم المعاينة متجر سلة التجريبي افتراضيًا. إعدادات التاجر ومكوّنات الرئيسية في `twilight.json`.

- [البدء مع Twilight React](https://docs.salla.dev/twilight/react/start/quick-start)
- [بوابة شركاء سلة](https://salla.partners/)

## Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `pnpm dev`            | Start the Vite dev server (workerd) |
| `pnpm build`          | Production build                    |
| `pnpm preview`        | Preview the production build        |
| `pnpm typecheck`      | TypeScript type checking            |
| `pnpm test`           | Run the test suite (Vitest)         |
| `pnpm check:manifest` | Validate `twilight.json`            |

## Deployment

Salla builds and publishes your theme on its own infrastructure — push to your
theme repository and the platform takes it from there. No deploy configuration,
credentials, or server runtime settings ship with this starter kit.
