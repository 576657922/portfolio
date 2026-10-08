// Static copy for every [data-i18n] element. English is also written into
// index.html so the page reads correctly before JS runs.

export const dict = {
  en: {
    'hero.l1': 'Full-stack web developer building',
    'hero.l2': 'web apps, MVPs and landing pages —',
    'hero.l3': 'code that ships on time and <em class="serif">still works.</em>',

    manifesto:
      'I build things that work <span class="pill"><img src="/images/arc-04.jpg" alt="" /></span> — then I make sure they keep working. Interfaces that feel effortless, systems that survive handover, and code the next developer will <em class="serif">thank me</em> <span class="pill"><img src="/images/arc-02.jpg" alt="" /></span> for.',
    'manifesto.foot': '3+ years. 40+ projects. Still obsessed with the last 5% — the loading state, the edge case, the README nobody asked for.',

    'work.t1': 'Selected',
    'work.t2': '<em class="serif">works</em> <sup class="mono">(06)</sup>',
    'work.lede': 'A handful of projects from the last few years — corporate sites, e-commerce and web apps, each taken from first commit to launch and beyond.',

    'archive.t1': 'Experiments,',
    'archive.t2': '<em class="serif">studies</em> &amp; noise',
    'archive.end': 'Curiosity is<br>the <em class="serif">real</em> client.',

    'about.t1': 'A developer who',
    'about.t2': '<em class="serif">thinks like a designer,</em>',
    'about.t3': 'and ships like',
    'about.t4': '<em class="serif">an engineer.</em>',
    'about.p1': 'I started building for the web in 2021, spent over two years shipping an online judge platform in React and Spring Boot, and now work from Tokyo as a freelance full-stack developer for Japanese brands.',
    'about.p2': 'My process is simple: read the codebase first, confirm requirements upfront, prove myself on one small task — then move fast and keep you in the loop.',
    'stat.1': 'Years building',
    'stat.2': 'Projects delivered',
    'stat.3': 'Languages shipped',
    'svc.1.t': 'Frontend',
    'svc.1.d': 'HTML, CSS, TypeScript, React, Next.js. Responsive interfaces and landing pages that load fast.',
    'svc.2.t': 'Backend',
    'svc.2.d': 'Supabase, PostgreSQL, MySQL, Node.js. Auth, dashboards, APIs — the layer behind every screen.',
    'svc.3.t': 'Enterprise',
    'svc.3.d': 'Java and Spring Boot. Systems built so the next person can pick them up easily.',
    'svc.4.t': 'Refactoring',
    'svc.4.d': 'I take over existing codebases, fix what needs attention and adapt as requirements change.',

    'deliver.t1': 'Handover is',
    'deliver.t2': 'the <em class="serif">deliverable.</em>',
    'deliver.lede': 'Four layers leave with you. The one at the bottom decides whether the other three survive without me.',
    'deliver.1.d': 'The screens people actually touch. Responsive, fast, built to the design — not near it.',
    'deliver.2.d': 'Routes, auth, the business rules. The part that has to still be correct at 3am.',
    'deliver.3.d': 'Schema, migrations, backups. Boring on purpose, because this is the layer you cannot redo later.',
    'deliver.4.d': 'README, env setup, deploy notes. Written so the next developer never has to email me.',

    'rev.t1': 'Revision',
    'rev.t2': '<em class="serif">history</em>',
    'rev.a': 'Started building for the web',
    'rev.b': 'Rakuten Securities — website QA',
    'rev.c': 'Shanghai Orizon — online judge system, React &amp; Spring Boot',
    'rev.d': 'Freelance — Brother SDGs, Demolition Help Center',
    'rev.e': 'Terra Arts — ongoing',
    'rev.f': 'Open for projects',

    'engage.t1': 'Three ways',
    'engage.t2': '<em class="serif">in</em>',
    'engage.a.t': 'Start small',
    'engage.a.d': 'One task first, so we both find out how this goes before anyone commits to a quarter.',
    'engage.a.n': 'Best if we haven’t worked together',
    'engage.b.t': 'Build it',
    'engage.b.d': 'Web app, MVP or landing page from scratch — front end and back end both handled.',
    'engage.b.n': 'Next.js · React · Supabase · Spring Boot',
    'engage.c.t': 'Take it over',
    'engage.c.d': 'Inherit a codebase someone else wrote, make it make sense, then keep it running.',
    'engage.c.n': 'Legacy · migration · maintenance',

    'contact.t1': 'Have a project?',
    'contact.t2': 'Let’s build it <em class="serif">properly.</em>',
    'contact.cta': 'Start a<br>project',
    copied: 'Copied to clipboard',

    'case.challenge': '( The challenge )',
    'case.approach': '( The approach )',
    'case.visit': 'Visit site',
    'case.next': 'Next project',
  },

  ja: {
    'hero.l1': 'Webアプリ、MVP、LPを',
    'hero.l2': '設計から実装まで。納期どおりに届き、',
    'hero.l3': '1年後も<em class="serif">ちゃんと動く</em>コードを。',

    manifesto:
      '動くものをつくる。<span class="pill"><img src="/images/arc-04.jpg" alt="" /></span>そして、動き続けるようにする。触れて心地よいインターフェース、引き継いでも崩れないシステム、そして次の開発者に<em class="serif">感謝される</em><span class="pill"><img src="/images/arc-02.jpg" alt="" /></span>コードを。',
    'manifesto.foot': '3年以上、40以上のプロジェクト。それでも最後の5%にこだわり続けています。ローディング表示、エッジケース、誰にも頼まれていないREADMEまで。',

    'work.t1': '主な',
    'work.t2': '<em class="serif">実績</em> <sup class="mono">(06)</sup>',
    'work.lede': 'ここ数年のプロジェクトから。コーポレートサイト、EC、Webアプリ。最初のコミットから公開、その先の運用まで。',

    'archive.t1': '実験と、',
    'archive.t2': '<em class="serif">習作</em>とノイズ',
    'archive.end': '好奇心こそ、<br><em class="serif">本当の</em>クライアント。',

    'about.t1': 'デザイナーの',
    'about.t2': '<em class="serif">目で考え、</em>',
    'about.t3': 'エンジニアとして',
    'about.t4': '<em class="serif">最後まで届ける。</em>',
    'about.p1': '2021年にWeb開発を始め、ReactとSpring Bootでオンラインジャッジを2年以上開発。現在は東京を拠点に、フリーランスのフルスタック開発者として日本のブランドと仕事をしています。',
    'about.p2': '進め方はシンプルです。まずコードを読み、要件を最初に確認する。小さなタスクで信頼をつくり、その後はスピードを上げて進捗を共有し続けます。',
    'stat.1': '開発歴（年）',
    'stat.2': '納品プロジェクト',
    'stat.3': '対応言語',
    'svc.1.t': 'フロントエンド',
    'svc.1.d': 'HTML、CSS、TypeScript、React、Next.js。速く表示されるレスポンシブなUIとLP。',
    'svc.2.t': 'バックエンド',
    'svc.2.d': 'Supabase、PostgreSQL、MySQL、Node.js。認証、管理画面、API。すべての画面を支える層。',
    'svc.3.t': 'エンタープライズ',
    'svc.3.d': 'Java、Spring Boot。次の担当者がすぐに引き継げるシステムを。',
    'svc.4.t': 'リファクタリング',
    'svc.4.d': '既存のコードを引き継ぎ、必要な部分を改善し、要件の変化に合わせて調整します。',

    'deliver.t1': '納品物は、',
    'deliver.t2': '<em class="serif">引き継ぎ</em>そのもの。',
    'deliver.lede': '4つのレイヤーをお渡しします。いちばん下の層が、ほかの3つが私なしでも生き残れるかを決めます。',
    'deliver.1.d': '実際に触れる画面。レスポンシブで速く、デザインに「近い」ではなく「そのまま」。',
    'deliver.2.d': 'ルーティング、認証、業務ロジック。深夜3時でも正しく動くべき部分。',
    'deliver.3.d': 'スキーマ、マイグレーション、バックアップ。後からやり直せない層だから、あえて地味に。',
    'deliver.4.d': 'README、環境構築、デプロイ手順。次の開発者が私に連絡しなくて済むように。',

    'rev.t1': '改訂',
    'rev.t2': '<em class="serif">履歴</em>',
    'rev.a': 'Web制作を始める',
    'rev.b': '楽天証券 — Webサイトのテスト',
    'rev.c': '上海オリゾン — オンラインジャッジ開発（React / Spring Boot）',
    'rev.d': 'フリーランス — Brother SDGs、解体工事窓口センター',
    'rev.e': 'Terra Arts — 継続中',
    'rev.f': '新規案件 受付中',

    'engage.t1': 'はじめ方は',
    'engage.t2': '<em class="serif">3つ</em>',
    'engage.a.t': '小さく始める',
    'engage.a.d': 'まずは1タスクから。長期の契約の前に、お互いの相性を確かめられます。',
    'engage.a.n': '初めてのご依頼におすすめ',
    'engage.b.t': 'ゼロからつくる',
    'engage.b.d': 'Webアプリ、MVP、LPをゼロから。フロントエンドもバックエンドもまとめて対応します。',
    'engage.b.n': 'Next.js · React · Supabase · Spring Boot',
    'engage.c.t': '引き継ぐ',
    'engage.c.d': '他の人が書いたコードを引き取り、理解できる形に整え、動かし続けます。',
    'engage.c.n': '既存改修・移行・保守',

    'contact.t1': 'つくりたいものが',
    'contact.t2': 'あれば、<em class="serif">ちゃんと</em>形に。',
    'contact.cta': '相談する',
    copied: 'コピーしました',

    'case.challenge': '( 課題 )',
    'case.approach': '( アプローチ )',
    'case.visit': 'サイトを見る',
    'case.next': '次のプロジェクト',
  },
};

let lang = (navigator.language || '').startsWith('ja') ? 'ja' : 'en';
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'ja') lang = saved;
} catch (e) {}

export const getLang = () => lang;
export const setLangValue = (l) => {
  lang = l;
  try { localStorage.setItem('lang', l); } catch (e) {}
};

// Resolve a {en, ja} field or plain string for the current language.
export const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.en : v);
export const t = (key) => dict[lang][key] ?? dict.en[key] ?? '';
