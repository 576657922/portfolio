// All site content lives here. Text fields are { en, ja }.
// Images marked TEMP are placeholders until the final artwork arrives.

export const projects = [
  {
    id: 'terra',
    title: 'Terra Arts',
    client: { en: 'Terra Arts', ja: 'Terra Arts' },
    tagline: { en: 'World craft, for everyday life.', ja: '世界の手仕事を、暮らしへ。' },
    desc: {
      en: 'Corporate site and online shop for an importer of handmade crafts from Italy and Mexico — built on WordPress, then grown through ongoing SEO.',
      ja: 'イタリアやメキシコの手仕事を届けるインポーターの公式サイト兼オンラインショップ。WordPressで構築し、SEOで育て続けています。',
    },
    challenge: {
      en: 'Every piece Terra Arts sells has a maker and a story behind it. The site had to carry that warmth while staying easy for a small team to update every week.',
      ja: 'Terra Artsが扱う品には、すべて作り手と物語がある。その温度を伝えながら、少人数のチームが毎週無理なく更新できるサイトが必要でした。',
    },
    approach: {
      en: 'A calm, image-led layout on a custom WordPress theme, with structured content so new products and news go live without touching code. The work continues: SEO, performance and new features as the business grows.',
      ja: '写真を主役にした落ち着いたレイアウトを、WordPressのオリジナルテーマで実装。商品やお知らせはコードに触れずに公開できる構造にしました。現在もSEO・表示速度の改善と機能追加を継続しています。',
    },
    services: ['WordPress', 'SEO', 'Maintenance'],
    stack: 'WordPress · PHP',
    role: { en: 'Build · SEO · Maintenance', ja: '構築・SEO・保守' },
    year: '2025 — Now',
    badge: 'Live · Ongoing',
    url: 'https://terra-arts.jp/',
    img: '/images/work/terra-hero.jpg',
    gallery: ['/images/work/terra-view-1.jpg', '/images/work/terra-view-2.jpg', '/images/work/terra-mobile.jpg'],
    size: 'xl',
  },
  {
    id: 'botanist',
    title: 'BOTANIST',
    client: { en: 'BOTANIST', ja: 'BOTANIST' },
    tagline: { en: 'New aging care.', ja: '新エイジングケア。' },
    desc: {
      en: 'Launch landing page for a new aging-care hair line — rich motion and crisp product shots, still fast on mobile.',
      ja: '新エイジングケアシリーズのLP。リッチな演出と商品の魅力を、モバイルでも軽快に。',
    },
    challenge: {
      en: 'Launch pages are won or lost on the first scroll. The brief: a premium feel and heavy imagery, with no compromise on mobile speed.',
      ja: 'LPは最初のスクロールで勝負が決まる。高級感とビジュアルの密度を保ちつつ、モバイルの表示速度は妥協しない。',
    },
    approach: {
      en: 'Built in Next.js with lazy-loaded imagery, scroll-triggered motion and a pixel-faithful implementation of the design.',
      ja: 'Next.jsで実装し、画像の遅延読み込みとスクロール連動の演出を組み合わせ、デザインを忠実に再現しました。',
    },
    services: ['Next.js', 'Landing page'],
    stack: 'Next.js',
    role: { en: 'Front-end · Freelance', ja: 'フロントエンド・副業' },
    year: '2025',
    badge: 'Freelance',
    img: '/images/work/botanist.jpg',
    gallery: ['/images/work/botanist.jpg', '/images/arc-04.jpg', '/images/arc-01.jpg'], // TEMP
    size: 'md',
  },
  {
    id: 'kynfolk',
    title: 'Kyn & Folk',
    client: { en: 'Kyn & Folk', ja: 'Kyn & Folk' },
    tagline: { en: 'Goods with a home.', ja: '暮らしに馴染む道具を。' },
    desc: {
      en: 'A headless e-commerce storefront in Next.js — fast product pages, a clean checkout and a CMS the shop team enjoys using.',
      ja: 'Next.jsによるヘッドレスECストア。高速な商品ページ、迷わないチェックアウト、運営チームが使いやすいCMS。',
    },
    challenge: {
      en: 'A growing lifestyle brand had outgrown its template store: slow pages, rigid layouts and no room to tell the story behind each product.',
      ja: '成長中のライフスタイルブランドが、テンプレートのストアでは表現しきれなくなっていました。表示が遅く、商品の背景を語る余地もない。',
    },
    approach: {
      en: 'Rebuilt as a Next.js storefront with statically generated product pages, image optimisation and an editorial layout system, so every collection can tell its own story.',
      ja: 'Next.jsで再構築し、商品ページの静的生成と画像最適化で高速化。コレクションごとに物語を語れる編集型レイアウトを用意しました。',
    },
    services: ['Next.js', 'E-commerce'],
    stack: 'Next.js · TypeScript',
    role: { en: 'Full-stack', ja: 'フルスタック' },
    year: '2026',
    badge: 'E-commerce',
    img: '/images/maison.jpg', // TEMP
    gallery: ['/images/stool.jpg', '/images/maison.jpg', '/images/halo.jpg'], // TEMP
    size: 'md',
  },
  {
    id: 'judge',
    title: 'Online Judge',
    client: { en: 'Shanghai Orizon', ja: '上海オリゾン' },
    tagline: { en: 'Code, judged in seconds.', ja: '提出したコードを、数秒で判定。' },
    desc: {
      en: 'An online judge for programming education — problem sets, live submissions and automated grading, built over two years in React and Spring Boot.',
      ja: 'プログラミング教育向けのオンラインジャッジ。問題管理、提出、自動採点までを、ReactとSpring Bootで2年以上かけて開発。',
    },
    challenge: {
      en: 'Every submission runs in isolation and needs a fast, trustworthy verdict — inside a codebase that many developers touch every week.',
      ja: '提出されたコードをそれぞれ隔離して実行し、速く正確に判定する。しかも多くの開発者が毎週触るコードベースの中で。',
    },
    approach: {
      en: 'I worked across the React front end and the Spring Boot services: the submission flow, verdict views, admin tooling, and steady refactoring so the system stayed easy to hand over.',
      ja: 'Reactのフロントエンドと Spring Boot のサービスの両方を担当。提出フロー、判定結果画面、管理ツール、そして引き継ぎやすさを保つための継続的なリファクタリング。',
    },
    services: ['React', 'Spring Boot'],
    stack: 'React · Spring Boot',
    role: { en: 'Full-stack engineer', ja: 'フルスタックエンジニア' },
    year: '2022 — 2024',
    badge: 'Full-stack · 2+ yrs',
    img: '/images/arc-05.jpg', // TEMP
    gallery: ['/images/arc-02.jpg', '/images/arc-05.jpg', '/images/arc-08.jpg'], // TEMP
    size: 'xl',
  },
  {
    id: 'brother',
    title: 'Brother SDGs',
    client: { en: 'Brother', ja: 'ブラザー' },
    tagline: { en: 'Small stories, shared future.', ja: '小さな物語から、未来へ。' },
    desc: {
      en: 'An editorial site for Brother’s sustainability stories — illustrated, friendly, and easy to extend as new stories arrive.',
      ja: 'ブラザーのSDGsへの取り組みを伝える特設サイト。イラストを活かした親しみやすい構成で、記事の追加も簡単に。',
    },
    challenge: {
      en: 'Sustainability content tends to read like an annual report. The goal was something people would actually want to scroll through.',
      ja: 'SDGsのコンテンツは報告書のようになりがち。最後まで読みたくなるサイトが求められました。',
    },
    approach: {
      en: 'Implemented in Next.js with illustration-led sections, gentle motion and a reusable story template.',
      ja: 'Next.jsで実装。イラスト主体のセクション、控えめなアニメーション、再利用できる記事テンプレートを用意しました。',
    },
    services: ['Next.js', 'Editorial'],
    stack: 'Next.js',
    role: { en: 'Front-end · Freelance', ja: 'フロントエンド・副業' },
    year: '2024',
    badge: 'Freelance',
    img: '/images/work/brother-sdgs.jpg',
    gallery: ['/images/work/brother-sdgs.jpg', '/images/arc-07.jpg', '/images/arc-03.jpg'], // TEMP
    size: 'md',
  },
  {
    id: 'haconese',
    title: 'Haconese',
    client: { en: 'Haconese', ja: 'Haconese' },
    tagline: { en: 'Pasta night, simplified.', ja: 'おうちで、本格パスタを。' },
    desc: {
      en: 'Product site for a pasta brand — appetising, light on its feet, and built in React.',
      ja: 'パスタブランドの商品サイト。食欲をそそるビジュアルを、Reactで軽快に。',
    },
    challenge: {
      en: 'A food brand lives on appetite appeal. The photography had to sing without slowing the page down.',
      ja: '食品ブランドは「おいしそう」が命。写真の魅力を保ったまま、ページを重くしないことが課題でした。',
    },
    approach: {
      en: 'Built in React with careful image handling, a modular product line-up and a layout that adapts cleanly to mobile.',
      ja: 'Reactで実装。画像の扱いを最適化し、商品ラインナップをモジュール化。モバイルでも崩れないレイアウトに。',
    },
    services: ['React', 'Product site'],
    stack: 'React',
    role: { en: 'Front-end · Freelance', ja: 'フロントエンド・副業' },
    year: '2023',
    badge: 'Freelance',
    img: '/images/work/haconese.jpg',
    gallery: ['/images/work/haconese.jpg', '/images/arc-06.jpg', '/images/arc-04.jpg'], // TEMP
    size: 'md',
  },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'site', label: 'Sites' },
  { id: 'app', label: 'Apps' },
  { id: 'lp', label: 'LP' },
];

export const index = [
  { id: 'terra', client: 'Terra Arts', name: { en: 'Terra Arts — site & shop', ja: 'Terra Arts 公式サイト' }, services: 'WordPress · SEO', year: '2025 — Now', cat: 'site', img: '/images/work/terra-hero.jpg' },
  { id: 'kynfolk', client: 'Kyn & Folk', name: { en: 'Kyn & Folk storefront', ja: 'Kyn & Folk ECサイト' }, services: 'Next.js · E-commerce', year: '2026', cat: 'app', img: '/images/maison.jpg' },
  { id: 'botanist', client: 'BOTANIST', name: { en: 'Aging-care launch LP', ja: 'BOTANIST LP' }, services: 'Next.js · LP', year: '2025', cat: 'lp', img: '/images/work/botanist.jpg' },
  { id: 'brother', client: 'Brother', name: { en: 'SDGs Story', ja: 'SDGs Story 特設サイト' }, services: 'Next.js · Editorial', year: '2024', cat: 'site', img: '/images/work/brother-sdgs.jpg' },
  { id: null, client: { en: 'Demolition Help Center', ja: '解体工事窓口センター' }, name: { en: 'Demolition Help Center', ja: '解体工事窓口センター' }, services: 'Next.js · Corporate', year: '2024', cat: 'site', img: '/images/work/kaitai-center.jpg' },
  { id: 'haconese', client: 'Haconese', name: { en: 'Haconese product site', ja: 'Haconese 商品サイト' }, services: 'React · Product', year: '2023', cat: 'site', img: '/images/work/haconese.jpg' },
  { id: 'judge', client: { en: 'Shanghai Orizon', ja: '上海オリゾン' }, name: { en: 'Online Judge system', ja: 'オンラインジャッジ開発' }, services: 'React · Spring Boot', year: '2022 — 2024', cat: 'app', img: '/images/arc-05.jpg' },
  { id: null, client: 'TSJ', name: { en: 'TSJ corporate site', ja: 'TSJ コーポレートサイト' }, services: 'HTML · CSS', year: '2022', cat: 'site', img: '/images/work/tsj-corporate.jpg' },
  { id: null, client: { en: 'Rakuten Securities', ja: '楽天証券' }, name: { en: 'Website QA', ja: 'Webサイト案件（テスト）' }, services: 'Testing', year: '2022', cat: 'site', img: '/images/arc-06.jpg' },
];

export const archive = [
  { title: 'Ink Study', meta: 'Shader · 2026', img: '/images/arc-01.jpg', ratio: '4/5' },
  { title: 'Tidal', meta: '3D Loop · 2025', img: '/images/arc-02.jpg', ratio: '1/1' },
  { title: 'Marble Noise', meta: 'GLSL · 2025', img: '/images/arc-03.jpg', ratio: '3/4' },
  { title: 'Smoke Field', meta: 'Particles · 2025', img: '/images/arc-04.jpg', ratio: '16/11' },
  { title: 'Signal', meta: 'Motion · 2024', img: '/images/arc-05.jpg', ratio: '4/5' },
  { title: 'Monolith', meta: 'Photo · 2024', img: '/images/arc-06.jpg', ratio: '3/4' },
  { title: 'Night Ridge', meta: 'Photo · 2023', img: '/images/arc-07.jpg', ratio: '16/11' },
  { title: 'Iridescence', meta: 'Material · 2023', img: '/images/arc-08.jpg', ratio: '1/1' },
];
