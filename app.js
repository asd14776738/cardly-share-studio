import { estimateReadingMinutes, buildKicker } from './reading-time.js';
import { buildAutoMediaLayout, chooseMediaLayout, fixedMediaColumns } from './media-layout.js';
import { buildContentPalette, summarizeImagePixels } from './palette-engine.js';
import { formatSourceLink } from './source-link.js';
import { mergeHashtags, splitHashtags } from './hashtags.js';

const platformIcons = {
  web: '/assets/icons/web.svg',
  x: '/assets/icons/x.svg',
  weibo: '/assets/icons/weibo.svg',
  telegram: '/assets/icons/telegram.svg',
  instagram: '/assets/icons/instagram.svg',
  zhihu: '/assets/icons/zhihu.svg',
  wechat: '/assets/icons/wechat.svg',
  xiaohongshu: '/assets/icons/xiaohongshu.svg',
  jike: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5AUcDgAeY7+ECgAAC/xJREFUeNrtnXuMXFUdx7+/e+exz2mX7XaLglQFGqEJVAqiIAlEERKDkgBF/1BMSCQKgooVoiA+8EEpWAwGo2gJhioBhWAVAmhj1BRpAYUi0T7p+73d3XnPPT//uPPamT2kOzNkOme+n2y629mdmzmzn/2d3/2d3z1XdMcQCJkOr90vgBy7UA5ihXIQK5SDWKEcxArlIFYoB7FCOYgVykGsUA5ihXIQK5SDWKEcxArlIFYoB7FCOYgVykGsUA5ihXIQK5SDWKEcxArlIFYoB7HSCjmk3YMgbw+tkEPbPQjy9sBphVihHMQK5SBWKAexQjmIFcpBrFAOYoVyECuUg1ihHMQK5SBWKAexQjmIFcpBrETa/QLayNvRauBUb0vXyiHwZjc0fAVEAa1zSzQtmnTJj26Vo2+J9n8e0ttA/FBgHBLATH1YvGDXwMSd0dw6ZybrLpRDIf3aezViZzQ2sSiQB/J1IUKjC/zCf6O5de0eYMvoQjkA+JA4FA2nHUZhKnIIirOMBDLIacUBmspGFTBa9T8pflZ1qp+2a+VoijByVCgpYRo41jEM5WgEowjqcw7ArcBBOWaOAqYyrahAwtChIowcBEZ1Ss5R/oqRg9TmHAAAVdcu76IcM0dhgECnyTmMW3ZQjkZQhVEItDornbam3tFQjkYwgCnmFypSSjWEOUfXE04ftdOKFs9iXIJyNIJRrZTPS9FClZGDlOocpaI5gGKtg5GDwGh4YlItBlTcSkcpR2MoYComaPgPT2UJABjVaeocXJUlWppWpll4a/dray2UoxGq6hwVVJiQknKdI8xESwGEp7IEKLcJFmukxQedc4NyNIRCq+sc4ReGZysE05bPufBGQsKEVMp2hJUOYeToerQm5yhhHKtyUI7GmLbOwZyDhJ1garSYiUppVmERjADQSp2jnIMKL00gAEqr81LtgsJwyZ7AmnM4Fjgox8xRe53DuKUH5WiEMCEtyhEusSgMm30IytNKsX6u5QfdChyUoyEMpiuCQZmQEmgp56juMWadgwDFaUUFUp2UGoW6s6sPQDkao3hpgkxZhS22hznkB+WYMeEpawB4dTkHIwcpnq3UZBjFCqlDflCOmVHd9CXVD7HOQUJUq5p9yrvFKddWCIqbt3i1DzLnIKUgEdZDS/0clUecgXLMGC1tGFds9UHRDi7ZE6A4ragnqKlzONZFSjlmjpZyz6kmBCyfE1jrHFx4I+Ur3mpOZZmQEkxpEyxfDamBY9e7dbEcjVckFAiAAFpaWyk1+0ChhXaPq5V0pRziNzNwrewJVnkEYfsPKEfH40NiDT857C4uJqRVaYdCI0hP2bKjw+lCORQShzfQ8PMDIG+02OxTpYJCY0i1e3StpAvlACQB6W/42TmjWRNOIlp9oziFxmXcpWJHF8qh8EchjUYOQcYgbbTmmunw8oQ4JilHR6PwT2rsjrIheaP5OjkggKqPXLtH10q6UA4f0dOqFlNnTCrQQn3rhsJHIS7Jdo+ulXSbHApJaHRhM4c4lNfclLghgCokLqmE7HXmVAXdJ4dBZD4ipzZziPGC5hV+ZefzYtHcl2yfjFOOTiZ2HrzhZu5FvS9n6nfwUUifHOqRCcrRoSgkoT0XN5Nw5IzuD+WY6oBRGZCDvZSjYzGILUbsrIafL8BkQQ/kTGnPp/ItNRAAc7w3o5Jt9xhbSTfJIT3adzVksPFShGBfzozlVYFAy9XzsBBmRr0tggLgt3ucLaN75AgQuwDxi5s8yta0SQbTNJlHJHu8v6ndY2wxXSKHQmZr/3XwhpqpYAYGG1NBQdWXqTf/U0l4Y6P+VpcSDnSRHH1L0HNRM4cQ4HDebEwGWlcBC1TmeluH/V2Uo+MIEDtXB24AYk0tfAg2pYK9WRMmHNXpqIHMj2zolUnK0VkY+O/SxLfgn9jkkphRvDxeSAfq1QngS3ZBdD1gXMpG4bocBt4wEt9G7ENNmiHA3qx5ebxQmVAq9VFvxN9+cuxfjoUNOC2HgTeExB3a+4kWLKMLXhov7MoY1GxwrghUTom+MuLvQu3Fsx2Pq3IE8EaRuEP7ljT/OxNgoqB/OZjLGfVrWs4hPnLvj//VR86xOQWOyhEgcoomvoOeS1oT6gUvjuVfnygAtdcyGcgJ0S1nxP/h3pwC5+RQQBC/SBO3I7qoJU1ZAhzJ6+p9uYyBV3eDcgNZ3LNmxN/t3pwCt+QIILPQ/1kduB7eaMva9QTPH8j9e7ygddmGQmZ5Bz7c+ycgcG9OgStyKKCILNTEUvRc2mw9owoRbEsFv9uTzal6Uw4qgAbwzulZc2r0VSfNgBNyGEgcPZfr4M2InNzCvWIFyAT6652ZbelAgGDKN1Uhg97Ypf2PRiRLOY5NAvjvwsBN2nc1pL/lnd9P7889dyCn4e6z5WMLABj1zut99vT4y66agU6WQwEP8Y/q4C2IndVM/860iOCVI4WV2zPpADWbtIR56Ki/64rEQ1HJUI5jDYX0of86HfhCqeevxWZsT5sVW1I7M4EvUtMUGF77+PGB3y6IbXDYDHSsHAaxD+rgVyF9LZ9KRHAwZ1ZsSb06UZBSU0/lu0AAf1HPi5cnVrl0Wey0dOzZuU5AW39hqgiO5PXHm1N/PpArX01vUPkoqMzyDl479JM5/h63zUDHyuEjt16Sv6o9h2iO0IwVW1J/2JczqNJCKx+AuSrx8Dm9f3d7QgnpUDkAFJD8GbJrWvXnK4KxvC7flHx8dzbQcI/i2o+8ehf2P/Pp2Ss91zaVnJ4OzTkAeDD7ZeKHGlkA/4RmV+QF+7Lm7k2pP+6b0j5efZpi4J8ef+2G4eUJb6yT/6hmQEcP0kdunUyugGabiR8i2JwMvvnG5FN7szVTSaDlVMN7Z+TNpSN3zo9u7vA3bQZ0/jhTj0jmyWYOsH6s8LX/TK45mNfqDAMVSwrGG/IPLh35/tm9a114x46azp1WQgSaxMTdiC5E5LQZTS4C5BWr92bv3ZLakZ6+nhH2hya8IzfPuesjA892lRkARHcMtfs1NI9B7yd19n2QxFH6EZ6YPPhmeuX29ESg4YlH/TMV3qA38fW5y5bM/o0fbubTTXR65AjxkF4t0cU68MWj+WkRvDERLN+cfP5ALtxONACm7O9V3Ojem+0fuWXusqtmP9qFZsAVOQDkMXk/YosQO+8tgocI8gZP783eszn1v2RQ7vmrfKrcWccbiez/xuhdl8960utKM+DKtBISIHaBHvcLW6ePCPZmzAPb0qt2ZsYLxW7QkOoyuAJG/XfHtt4+7wcXDz4nXalFiEtyAAAGrtfEbTURUQADrD2cX7Yp+cLhvAJ1v/KKHgbemb2vfnfe987uW9dtGWgNzkwrIYrkQ4gtRs9l5eAhgvG8Prwj/cC29J6s8VHZI3JKfBFVFYF+LPHc7fN+9N5YF9UzbDgmh0DHZOIujZwWdoWJYMN4Ydmm1DP7s3kDT6a5T0oYNYzx+rz0NcetunHuA8P+IZoBB6cVADDo+xRmLc9o7xO7M8s3pzYmA+8tc4dAvRNju5bOvf/KoSfikuvO9LMexyJHiCD9+8NYfOeuJY/sTCUL6tUWuBQQKfYICaDn979w2/H3fqBvffHpBICzcmjGTKx4/eBJRwpnRhAY1N0KRRSAUX/Qm/zM8GM3jfx8XmwP1P1V+Bnh5LQSEvxt8txrtt2zOz/Xk/otZcWovK9n463zfnrZrGdikmOSUY/D74h//sA/bxj5pS/5YGpbRsGIj/yVQ6sfmf+lK4aeikne6fehcZycVip8bvjRtckzHx+7pNyeE8A7MbrnK6MPXjP82IA/CaUWVhyeVsLxmddSC5Zsue+NzHs8qIheOLD2jnfcd27/SwIw93xrXJcDAMyqQ5d9ecetqnLtnMduHF05N7qfuefR0A1yIK/++tRCD7qob0NUCgwYR0lXyAEAEgBgwJgRjiekFajFzGGuTqxQDmKFchArlINYoRzECuUgVigHsUI5iBXKQaxQDmKFcrhIixYWKYeLtGgPPcpBrFAOYoVyECuUg1ihHMQK5SBWKAexQjmIFcpBrFAOYoVyECuUg1ihHMQK5SBWKAexQjmIFcpBrFAOYoVyECuUg1j5P+JqT8sH9EHfAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTI4VDE0OjAwOjMwKzAyOjAw7AmgSAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0yOFQxNDowMDozMCswMjowMJ1UGPQAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=',
  netease: '/assets/icons/netease.svg',
  qqmusic: '/assets/icons/qqmusic.svg',
  douban: '/assets/icons/douban.svg',
  douyin: '/assets/icons/douyin.svg',
  spotify: '/assets/icons/spotify.svg',
  apple: '/assets/icons/apple.svg',
  threads: '/assets/icons/threads.svg',
  chatgpt: '/assets/icons/chatgpt.svg',
  kimi: '/assets/icons/kimi.svg'
};

function iconForUrl(value) {
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'x.com' || host === 'twitter.com') return platformIcons.x;
  if (host === 'weibo.com' || host.endsWith('.weibo.com') || host === 'weibo.cn' || host.endsWith('.weibo.cn')) return platformIcons.weibo;
  if (host === 't.me' || host === 'telegram.org') return platformIcons.telegram;
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return platformIcons.instagram;
  if (host === 'zhihu.com' || host.endsWith('.zhihu.com')) return platformIcons.zhihu;
  if (host === 'mp.weixin.qq.com') return platformIcons.wechat;
  if (host === 'xiaohongshu.com' || host.endsWith('.xiaohongshu.com') || host === 'xhslink.com') return platformIcons.xiaohongshu;
  if (host === 'okjike.com' || host.endsWith('.okjike.com')) return platformIcons.jike;
  if (host === 'music.163.com' || host.endsWith('.music.163.com') || host === '163cn.tv' || host.endsWith('.163cn.tv')) return platformIcons.netease;
  if (host === 'y.qq.com' || host.endsWith('.y.qq.com')) return platformIcons.qqmusic;
  if (host === 'douban.com' || host.endsWith('.douban.com')) return platformIcons.douban;
  if (host === 'douyin.com' || host.endsWith('.douyin.com') || host === 'v.douyin.com') return platformIcons.douyin;
  if (host === 'open.spotify.com') return platformIcons.spotify;
  if (host === 'music.apple.com') return platformIcons.apple;
  if (host === 'threads.com' || host.endsWith('.threads.com') || host === 'threads.net' || host.endsWith('.threads.net')) return platformIcons.threads;
  if (host === 'chatgpt.com' || host === 'chat.openai.com') return platformIcons.chatgpt;
  if (host === 'kimi.com' || host.endsWith('.kimi.com') || host === 'kimi.moonshot.cn') return platformIcons.kimi;
  return platformIcons.web;
}

const defaults = {
  source: 'web',
  platform: 'web',
  contentStatus: 'ok',
  readingMinutes: null,
  metricType: '',
  metricCount: null,
  colorMode: 'auto',
  sourceLabel: 'ARCHDAILY.CN',
  ratio: 'auto',
  layout: 'editorial',
  theme: 'coastal',
  font: 'sans',
  radius: 18,
  padding: 32,
  url: 'https://www.archdaily.cn/cn/1012043',
  title: '在海风与山影之间，重新想象公共空间',
  description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
  author: 'ARCHDAILY.CN',
  image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=88'
};

defaults.images = [defaults.image];

defaults.icon = iconForUrl(defaults.url);

const sourceData = {
  web: {
    hint: '支持文章、作品集、产品页等公开网页',
    placeholder: 'https://example.com/article',
    name: 'ARCHDAILY.CN', icon: '⌁', iconUrl: defaults.icon, kicker: 'ARCHITECTURE · 6 MIN READ',
    title: '在海风与山影之间，重新想象公共空间',
    description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
    image: defaults.image
  },
  weibo: {
    hint: '支持微博正文、图集和整段分享口令；受限内容可继续手动编辑',
    placeholder: 'https://weibo.com/user/status 或粘贴整段分享文案',
    name: '微博', icon: '微', iconUrl: iconForUrl('https://weibo.com'),
    title: '今天也想记录一点值得留住的事。',
    description: '粘贴公开微博链接，Cardly 会提取正文、作者与图片；若平台限制匿名读取，仍可手动补全。',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=88'
  },
  xiaohongshu: {
    hint: '支持小红书公开笔记与 xhslink 短链',
    placeholder: 'https://www.xiaohongshu.com/discovery/item/…',
    name: '小红书', icon: 'RED', iconUrl: iconForUrl('https://www.xiaohongshu.com'),
    title: '週末，在城市里收集光影。',
    description: '穿过旧街区，玻璃、树影和晾晒的衣服让平常的一天有了电影感。',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=88'
  },
  douyin: {
    hint: '支持抖音视频长链、v.douyin.com 短链与整段分享口令',
    placeholder: 'https://v.douyin.com/… 或粘贴整段分享文案',
    name: '抖音', icon: '♪', iconUrl: iconForUrl('https://www.douyin.com'),
    title: '把一瞬间，留成一张值得分享的卡片。',
    description: '公开作品会自动提取标题、作者与封面；已下架或受限作品会清楚提示，不再显示错误内容。',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=88'
  },
  telegram: {
    hint: '粘贴公开频道或公开消息链接',
    placeholder: 'https://t.me/channel/123',
    name: 'TELEGRAM · @FUTURESPACE', icon: '↗', iconUrl: iconForUrl('https://t.me'), kicker: 'CHANNEL POST · 2 HOURS AGO',
    title: '城市不是建成的，它每天都在被重新协商。',
    description: '从街角座椅到夜间照明，微小的公共决策正在改变我们感受城市的方式。',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=88'
  },
  x: {
    hint: '粘贴公开帖子链接，自动提取作者和正文',
    placeholder: 'https://x.com/user/status/…',
    name: 'X · @DESIGNNOTES', icon: '𝕏', iconUrl: iconForUrl('https://x.com'), kicker: 'POST · JUL 11, 2026',
    title: 'Good design makes complexity feel inevitable.',
    description: 'The best interfaces do not remove depth. They give it rhythm, hierarchy and a human pace.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=88'
  },
  instagram: {
    hint: '粘贴公开帖子或 Reel 链接',
    placeholder: 'https://www.instagram.com/p/…',
    name: 'INSTAGRAM · @SLOW.WEEKEND', icon: '◎', iconUrl: iconForUrl('https://www.instagram.com'), kicker: 'PHOTO · SHANGHAI',
    title: '週末，在城市里收集光影。',
    description: '穿过旧街区，玻璃、树影和晾晒的衣服让平常的一天有了电影感。',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=88'
  }
};

const themeConfig = {
  coastal: { name: '海盐', stops: ['#a9dfe8','#eaf1ea','#efc8b5'], surface: 'rgba(255,255,255,.82)', text: '#171b20', dark: false },
  ink: { name: '墨夜', stops: ['#11151c','#313b4a','#657080'], surface: 'rgba(13,17,24,.80)', text: '#ffffff', dark: true },
  paper: { name: '暖纸', stops: ['#d8c39e','#eee4cf','#fbf7ed'], surface: 'rgba(255,252,244,.84)', text: '#27231d', dark: false },
  film: { name: '胶片', stops: ['#756a58','#b6a582','#d9d2c1'], surface: 'rgba(248,243,232,.78)', text: '#26241f', dark: false },
  berry: { name: '莓果', stops: ['#571536','#a94968','#e6acac'], surface: 'rgba(52,12,31,.76)', text: '#ffffff', dark: true },
  jade: { name: '青岚', stops: ['#245b59','#75a197','#dce7d3'], surface: 'rgba(240,247,240,.80)', text: '#17302f', dark: false },
  sky: { name: '天光', stops: ['#6eb2e5','#b9dcf3','#eaf7fb'], surface: 'rgba(255,255,255,.82)', text: '#172a3d', dark: false },
  lilac: { name: '鸢尾', stops: ['#806ab7','#c4b5df','#eee9f7'], surface: 'rgba(250,248,255,.80)', text: '#27213b', dark: false },
  sunrise: { name: '晨曦', stops: ['#f27d62','#f8b88a','#ffe3b4'], surface: 'rgba(255,250,242,.82)', text: '#342018', dark: false },
  moss: { name: '苔原', stops: ['#314a39','#6f8659','#b4bd88'], surface: 'rgba(27,43,31,.76)', text: '#ffffff', dark: true },
  sand: { name: '沙丘', stops: ['#a77c50','#cda878','#ead7b0'], surface: 'rgba(255,249,236,.80)', text: '#34271b', dark: false },
  slate: { name: '岩灰', stops: ['#3e4651','#7c8792','#cbd0d5'], surface: 'rgba(24,29,35,.76)', text: '#ffffff', dark: true },
  coral: { name: '珊瑚', stops: ['#de574f','#f58d78','#ffd1bd'], surface: 'rgba(255,248,242,.82)', text: '#3a1e1a', dark: false },
  cobalt: { name: '钴蓝', stops: ['#1748cc','#4f7ee4','#a5c1fa'], surface: 'rgba(13,34,91,.76)', text: '#ffffff', dark: true },
  lime: { name: '青柠', stops: ['#9fbd39','#cbdc72','#edf3b2'], surface: 'rgba(252,255,239,.82)', text: '#25300f', dark: false },
  midnight: { name: '午夜', stops: ['#06182d','#253d70','#8d5d79'], surface: 'rgba(4,13,29,.78)', text: '#ffffff', dark: true },
  rose: { name: '蔷薇', stops: ['#a53e60','#d6788f','#f1becb'], surface: 'rgba(255,246,249,.80)', text: '#371724', dark: false },
  mono: { name: '黑白', stops: ['#0a0a0a','#767676','#eeeeee'], surface: 'rgba(255,255,255,.86)', text: '#111111', dark: false },
};

const state = { ...defaults, images: [...defaults.images] };
state.imageColors = {};
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
qsa('[data-platform-icon]').forEach(image => {
  image.src = platformIcons[image.dataset.platformIcon] || platformIcons.web;
});
const card = qs('#share-card');
const titleInput = qs('#card-title');
const descriptionInput = qs('#card-description');
const urlInput = qs('#source-url');
const authorInput = qs('#card-author');

function setMobilePanel(panel, { scroll = true } = {}) {
  if (!['content', 'preview', 'style', 'history'].includes(panel)) return;
  document.body.dataset.mobilePanel = panel;
  qsa('[data-mobile-panel-target]').forEach(button => {
    const active = button.dataset.mobilePanelTarget === panel;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (scroll && matchMedia('(max-width: 760px)').matches) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

qsa('[data-mobile-panel-target]').forEach(button => {
  button.addEventListener('click', () => setMobilePanel(button.dataset.mobilePanelTarget));
});

qs('.app-topbar .brand')?.addEventListener('click', () => {
  if (matchMedia('(max-width: 760px)').matches) setMobilePanel('content');
});

function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function extractUrlFromShare(value) {
  const match = String(value || '').match(/https?:\/\/[^\s<>"'，。]+/i);
  return match ? match[0].replace(/[)\]】）]+$/, '') : '';
}

function paletteForContent() {
  return buildContentPalette({
    title: state.title,
    description: state.description,
    url: state.url,
    platform: state.platform,
    imageColors: Object.values(state.imageColors || {}).filter(Boolean),
  });
}

function syncPalettePreview(palette) {
  const paletteBars = qsa('#auto-palette i');
  [...palette.stops, palette.text].forEach((color, index) => {
    if (paletteBars[index]) paletteBars[index].style.background = color;
  });
  const label = qs('#recommend-label');
  if (label) label.textContent = `自动开启 · ${palette.reason}`;
}

function refreshContentPalette() {
  state.dynamicTheme = paletteForContent();
  state.recommendedTheme = 'dynamic';
  if (state.colorMode !== 'manual') {
    state.colorMode = 'auto';
    state.theme = 'dynamic';
  }
  syncPalettePreview(state.dynamicTheme);
  qsa('.theme-swatch').forEach(item => item.classList.toggle('active', state.colorMode === 'manual' && item.dataset.theme === state.theme));
  if (card) updateCard();
}

let paletteTimer = null;
function schedulePaletteRefresh() {
  clearTimeout(paletteTimer);
  paletteTimer = setTimeout(refreshContentPalette, 90);
}

function sampleImagePalette(image, src) {
  if (Object.prototype.hasOwnProperty.call(state.imageColors || {}, src)) return;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 36;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    state.imageColors = { ...(state.imageColors || {}), [src]: summarizeImagePixels(pixels) };
    schedulePaletteRefresh();
  } catch {
    state.imageColors = { ...(state.imageColors || {}), [src]: null };
  }
}

function setRecommendedTheme() {
  state.colorMode = 'auto';
  refreshContentPalette();
}
function titleRole(text) {
  return /(\(@[^)]+\)|\bon\s+X$|^@\w+)/i.test(String(text || '').trim()) ? 'publisher' : 'headline';
}

function contentDensity(text) {
  const length = String(text || '').trim().length;
  if (length <= 90) return 'short';
  if (length <= 320) return 'medium';
  return 'long';
}

function liveKicker() {
  return buildKicker({
    platform: state.platform || state.source || 'web',
    status: state.contentStatus,
    readingMinutes: state.readingMinutes,
    description: state.description,
    metricType: state.metricType,
    metricCount: state.metricCount,
  });
}

function applyMediaGalleryLayout(gallery) {
  const images = [...gallery.querySelectorAll('img')];
  if (!images.length || images.some(image => !image.complete || !image.naturalWidth)) return;
  const layout = chooseMediaLayout(images);
  gallery.className = `media-gallery media-count-${Math.min(images.length, 4)} gallery-layout-${layout.type}`;
  gallery.classList.toggle('gallery-portrait', layout.portrait);
  gallery.style.setProperty('--gallery-columns', layout.columns);
  const fixedColumns = fixedMediaColumns(images.length);
  gallery.style.setProperty('--fixed-columns', fixedColumns);
  const orderByIndex = new Map(layout.orderedIndices.map((index, order) => [index, order + 1]));
  images.forEach((image, index) => {
    image.classList.toggle('media-hero', index === layout.heroIndex);
    image.classList.toggle('media-wide', layout.wideIndices.includes(index));
    image.style.order = orderByIndex.get(index);
  });
}

function renderMediaGallery() {
  const gallery = qs('#media-gallery');
  const images = (state.images || []).filter(Boolean).slice(0, 12);
  const activeSources = new Set(images);
  state.imageColors = Object.fromEntries(Object.entries(state.imageColors || {}).filter(([src]) => activeSources.has(src)));
  gallery.className = `media-gallery media-count-${Math.min(images.length, 4)}`;
  gallery.replaceChildren();
  if (!images.length) return;
  images.forEach((src, index) => {
    const image = document.createElement('img');
    image.crossOrigin = src.startsWith('data:') ? null : 'anonymous';
    image.src = src;
    image.alt = `内容图片 ${index + 1}`;
    image.addEventListener('load', () => {
      applyMediaGalleryLayout(gallery);
      sampleImagePalette(image, src);
    }, { once: true });
    gallery.appendChild(image);
  });
}

function updateCard() {
  const content = canvasContent();
  const density = contentDensity(content.description);
  const role = titleRole(content.title);
  const mediaCount = (state.images || []).filter(Boolean).length;
  const mediaState = mediaCount ? 'has-media' : 'no-media';
  const mediaVolume = mediaCount >= 10 ? 'media-packed' : mediaCount >= 5 ? 'media-many' : 'media-regular';
  const theme = state.theme === 'dynamic'
    ? state.dynamicTheme || paletteForContent()
    : themeConfig[state.theme] || themeConfig.coastal;
  const duplicateTitle = content.duplicateTitle;
  card.className = `share-card theme-${state.theme} ratio-${state.ratio} layout-${state.layout} source-${state.source} density-${density} title-${role} ${duplicateTitle ? 'title-duplicate' : ''} ${mediaState} ${mediaVolume} font-${state.font || 'sans'}`;
  card.style.setProperty('--theme-a', theme.stops[0]);
  card.style.setProperty('--theme-b', theme.stops[1]);
  card.style.setProperty('--theme-c', theme.stops[2]);
  card.style.setProperty('--theme-surface', theme.surface);
  card.style.setProperty('--theme-text', theme.text);
  card.style.setProperty('--card-radius', `${state.radius || 0}px`);
  card.style.setProperty('--surface-pad', `${state.padding || 32}px`);
  const titleNode = qs('#preview-card-title');
  titleNode.textContent = content.title;
  titleNode.hidden = !content.title;
  const descriptionNode = qs('#preview-card-description');
  descriptionNode.textContent = content.description;
  descriptionNode.hidden = !content.description;
  const tagsNode = qs('#preview-card-tags');
  tagsNode.replaceChildren(...content.hashtags.map(tag => {
    const item = document.createElement('span');
    item.textContent = tag;
    return item;
  }));
  tagsNode.hidden = !content.hashtags.length;
  const sourceLabel = state.sourceLabel || sourceData[state.source].name;
  const publisherLabel = state.author || sourceLabel;
  qs('#source-name').textContent = publisherLabel;
  const sourceMeta = qs('.card-number');
  if (sourceMeta) sourceMeta.textContent = sourceLabel;
  const byline = qs('#card-byline');
  if (byline) {
    byline.hidden = !sourceLabel;
    byline.textContent = '来源 · ' + sourceLabel;
  }
  const sourceIcon = qs('#source-icon-image');
  const sourceFallback = qs('.source-brand-fallback');
  sourceFallback.textContent = sourceData[state.source].icon;
  const nextIcon = state.icon || '';
  const sameIcon = sourceIcon.getAttribute('src') === nextIcon;
  const iconFailed = sameIcon && sourceIcon.complete && !sourceIcon.naturalWidth;
  sourceIcon.hidden = !nextIcon || iconFailed;
  sourceFallback.hidden = !sourceIcon.hidden;
  sourceIcon.crossOrigin = 'anonymous';
  if (!sameIcon) sourceIcon.src = nextIcon;
  sourceIcon.alt = sourceLabel;
  qs('#card-kicker').textContent = liveKicker();
  renderMediaGallery();
  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  qs('#footer-date').textContent = `${time} · ${date}`;
  const sourceLink = formatSourceLink(state.url);
  const footerSourceLink = qs('#footer-source-link');
  const footerArrowLink = qs('#footer-arrow-link');
  const footerSourceUrl = qs('#footer-source-url');
  footerSourceLink.hidden = !sourceLink.href;
  footerSourceLink.href = sourceLink.href || '#';
  footerSourceLink.setAttribute('aria-label', sourceLink.display ? `阅读原文：${sourceLink.display}` : '阅读原文');
  footerArrowLink.href = sourceLink.href || '#';
  footerArrowLink.hidden = !sourceLink.href;
  footerSourceUrl.textContent = sourceLink.display;
  footerSourceUrl.classList.toggle('is-long', sourceLink.display.length > 84);
  footerSourceUrl.classList.toggle('is-very-long', sourceLink.display.length > 160);
  qs('#char-count').textContent = `${state.description.length} 字 · ${density === 'short' ? '短内容' : density === 'medium' ? '中等内容' : '长内容'}`;
  qs('#image-count').textContent = state.images?.length ? `${state.images.length} 张图片 · 自动排列` : '可多选，自动排列';
  qs('#canvas-size').textContent = state.ratio === 'auto' ? '1080 × 自动高度' : state.ratio === 'wide' ? '1600 × 900' : state.ratio === 'portrait' ? '1080 × 1350' : '1080 × 1080';
}

function selectSource(source, applyPreset = true) {
  state.source = source;
  qsa('.source-tab').forEach(tab => {
    const selected = tab.dataset.source === source;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  urlInput.placeholder = sourceData[source].placeholder;
  qs('#source-hint').textContent = sourceData[source].hint;
  if (applyPreset) {
    state.title = sourceData[source].title;
    state.description = sourceData[source].description;
    state.platform = source;
    state.sourceLabel = sourceData[source].name;
    state.contentStatus = 'ok';
    state.readingMinutes = null;
    state.metricType = '';
    state.metricCount = null;
    state.image = sourceData[source].image;
    state.images = [sourceData[source].image];
    state.imageColors = {};
    state.icon = sourceData[source].iconUrl;
    state.author = sourceData[source].name;
    authorInput.value = state.author;
    titleInput.value = state.title;
    descriptionInput.value = state.description;
  }
  refreshContentPalette();
}

qsa('.source-tab').forEach(tab => tab.addEventListener('click', () => selectSource(tab.dataset.source)));

qs('#ratio-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-ratio]');
  if (!button) return;
  state.ratio = button.dataset.ratio;
  qsa('#ratio-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#layout-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-layout]');
  if (!button) return;
  state.layout = button.dataset.layout;
  qsa('#layout-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#theme-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-theme]');
  if (!button) return;
  state.theme = button.dataset.theme;
  state.colorMode = 'manual';
  qs('#recommend-label').textContent = `当前主题 · ${themeConfig[state.theme].name}`;
  qsa('.theme-swatch').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#theme-toggle').addEventListener('click', () => {
  const list = qs('#theme-control');
  const expanded = list.classList.toggle('show-all');
  qs('#theme-toggle').textContent = expanded ? '收起主题' : '查看全部 18 个';
});

qs('#recommend-theme').addEventListener('click', () => {
  setRecommendedTheme();
  showToast('实时配色已开启，会跟随正文与配图更新');
});

qs('#font-control').addEventListener('change', event => { state.font = event.target.value; updateCard(); });
qs('#radius-control').addEventListener('input', event => { state.radius = Number(event.target.value); qs('#radius-value').textContent = event.target.value; updateCard(); });
qs('#padding-control').addEventListener('input', event => { state.padding = Number(event.target.value); qs('#padding-value').textContent = event.target.value; updateCard(); });

let zoomLevel = 90;
function setZoom(next) {
  zoomLevel = Math.max(60, Math.min(110, next));
  card.style.setProperty('--preview-scale', zoomLevel / 100);
  qs('#zoom-value').textContent = `${zoomLevel}%`;
}
qs('#zoom-out').addEventListener('click', () => setZoom(zoomLevel - 5));
qs('#zoom-in').addEventListener('click', () => setZoom(zoomLevel + 5));

refreshContentPalette();
setZoom(100);

titleInput.addEventListener('input', () => {
  state.title = titleInput.value || '输入你的标题';
  schedulePaletteRefresh();
});
authorInput.addEventListener('input', () => {
  state.author = authorInput.value || sourceData[state.source].name;
  updateCard();
});

descriptionInput.addEventListener('input', () => {
  state.description = descriptionInput.value.slice(0, 2000);
  state.readingMinutes = null;
  state.metricType = '';
  state.metricCount = null;
  if (descriptionInput.value !== state.description) descriptionInput.value = state.description;
  schedulePaletteRefresh();
});

qs('#image-upload').addEventListener('change', async event => {
  const files = [...(event.target.files || [])].slice(0, 12);
  if (!files.length) return;
  if (files.some(file => file.size > 8 * 1024 * 1024)) return showToast('每张图片请控制在 8MB 以内');
  state.images = await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
  state.image = state.images[0];
  state.imageColors = {};
  refreshContentPalette();
  showToast(`已载入 ${state.images.length} 张图片，版式已自动调整`);
});

qs('#source-icon-image').addEventListener('error', () => {
  qs('#source-icon-image').hidden = true;
  qs('.source-brand-fallback').hidden = false;
});

qs('#generate-button').addEventListener('click', async () => {
  const button = qs('#generate-button');
  const rawValue = urlInput.value.trim();
  const value = extractUrlFromShare(rawValue);
  if (!value) { urlInput.focus(); return showToast('请粘贴包含 https:// 的公开链接或分享口令'); }
  urlInput.value = value;
  button.classList.add('loading');
  button.textContent = '正在生成…';
  state.url = value;
  state.platform = state.source;
  state.contentStatus = 'ok';
  state.readingMinutes = null;
  state.metricType = '';
  state.metricCount = null;
  state.icon = iconForUrl(value);
  state.image = '';
  state.images = [];
  state.imageColors = {};
  const host = new URL(value).hostname.replace(/^www\./, '').toUpperCase();
  sourceData[state.source].name = host;
  state.title = host;
  state.description = '';
  state.author = host;
  state.sourceLabel = host;
  authorInput.value = state.author;
  titleInput.value = state.title;
  descriptionInput.value = '';
  try {
    const response = await fetch('/api/extract?url=' + encodeURIComponent(value));
    const metadata = await response.json().catch(() => null);
    if (!response.ok) throw new Error(metadata?.detail || metadata?.error || '提取失败');
    state.platform = metadata?.platform || state.source;
    state.author = metadata?.author || metadata?.platformLabel || host;
    const extractedTitle = String(metadata?.title || '').trim();
    const compactTitle = extractedTitle.replace(/\s+/g, '');
    const compactAuthor = String(state.author || '').replace(/\s+/g, '');
    const redundantWeiboTitle = state.platform === 'weibo' && (
      !extractedTitle ||
      compactTitle === '\u5fae\u535a' ||
      compactTitle === compactAuthor + '\u7684\u5fae\u535a'
    );
    state.title = redundantWeiboTitle ? '' : extractedTitle || host;
    if (sourceData[state.platform]) {
      state.source = state.platform;
      qsa('.source-tab').forEach(tab => {
        const selected = tab.dataset.source === state.source;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
    }
    authorInput.value = state.author;
    const sourceLabels = { douyin: '\u6296\u97f3', weibo: '微博', xiaohongshu: '小红书', instagram: 'Instagram', x: 'X' };
    state.sourceLabel = sourceLabels[state.platform] || metadata?.platformLabel || host;
    state.contentStatus = metadata?.status || 'ok';
    state.readingMinutes = Number.isFinite(metadata?.readingMinutes) ? metadata.readingMinutes : estimateReadingMinutes(metadata?.description);
    state.metricType = metadata?.metricType === 'views' || metadata?.metricType === 'likes' ? metadata.metricType : '';
    state.metricCount = Number.isFinite(metadata?.metricCount) ? metadata.metricCount : null;
    const accessMessage = metadata?.status === 'login_required'
      ? `${metadata.platformLabel || '该平台'}限制匿名读取，请上传截图或手动粘贴正文`
      : metadata?.status === 'unavailable'
        ? `${metadata.platformLabel || '该内容'}已下架、审核中或仅自己可见，可手动粘贴正文继续排版`
        : metadata?.status === 'partial'
          ? '只提取到有限公开信息，可手动补充标题、正文和图片'
          : '';
    state.description = (metadata?.description || accessMessage).slice(0, 2000);
    titleInput.value = state.title;
    descriptionInput.value = state.description;
    const extractedImages = Array.isArray(metadata?.images)
      ? metadata.images.filter(Boolean)
      : (metadata?.image ? [metadata.image] : []);
    if (extractedImages.length) {
      state.images = [...new Set(extractedImages)].slice(0, 12);
      state.image = state.images[0];
      state.imageColors = {};
    }
    if (metadata?.platformLabel) sourceData[state.source].name = metadata.platformLabel.toUpperCase();
    const extractStatus = qs('#extract-status');
    const extractSummary = qs('#extract-summary');
    extractStatus.hidden = false;
    extractStatus.classList.toggle('is-limited', metadata?.status !== 'ok');
    extractStatus.querySelector('strong').textContent = metadata?.status === 'ok' ? '已提取' : '需要补充';
    extractSummary.textContent = metadata?.status === 'ok'
      ? `${state.images.length} 张图片 · 可继续编辑`
      : (metadata?.status === 'login_required' ? '平台限制匿名读取' : '仅提取到公开摘要');
    if (metadata?.status === 'login_required') {
      showToast(`${metadata.platformLabel || '该平台'}限制匿名访问，可上传截图继续排版`);
    } else if (metadata?.status === 'partial') {
      showToast('只提取到有限公开信息，可继续手动补充');
    } else if (state.images.length > 1) {
      showToast(`已提取正文和 ${state.images.length} 张图片，可继续编辑`);
    } else {
      showToast(metadata?.title ? '已提取公开内容，可继续编辑' : '未找到公开内容，可手动编辑卡片');
    }
    setMobilePanel('preview');
  } catch {
    showToast('暂时无法提取该链接，请重试或上传截图');
  } finally {
    refreshContentPalette();
    button.classList.remove('loading');
    button.innerHTML = '<span>生成卡片</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-4-4 4 4-4 4"/></svg>';
  }
});

qs('#reset-button').addEventListener('click', () => {
  Object.assign(state, defaults, { images: [...defaults.images] });
  urlInput.value = defaults.url;
  titleInput.value = defaults.title;
  descriptionInput.value = defaults.description;
  authorInput.value = defaults.author;
  qs('#extract-status').hidden = true;
  qs('#font-control').value = defaults.font;
  qs('#radius-control').value = defaults.radius;
  qs('#padding-control').value = defaults.padding;
  qsa('#ratio-control button').forEach(x => x.classList.toggle('active', x.dataset.ratio === state.ratio));
  qsa('#layout-control button').forEach(x => x.classList.toggle('active', x.dataset.layout === state.layout));
  qsa('.theme-swatch').forEach(x => x.classList.toggle('active', x.dataset.theme === state.theme));
  selectSource('web', false);
  showToast('已恢复默认样式');
});

qsa('.recent-card').forEach(item => item.addEventListener('click', () => {
  const preset = item.dataset.preset;
  if (sourceData[preset]) selectSource(preset);
  document.querySelector('#studio').scrollIntoView({ behavior: 'smooth' });
}));

qs('#clear-recent').addEventListener('click', () => {
  const grid = qs('.recent-grid');
  grid.innerHTML = '';
  grid.classList.add('is-empty');
});

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = [...text];
  let line = '', lines = [];
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = char; }
    else line = test;
  }
  if (line) lines.push(line);
  lines = lines.slice(0, maxLines);
  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function canvasLines(ctx, text, maxWidth, maxLines = Infinity) {
  const lines = [];
  for (const paragraph of String(text || '').split(/\n/)) {
    if (!paragraph) { lines.push(''); continue; }
    let line = '';
    for (const char of [...paragraph]) {
      const test = line + char;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = char;
        if (lines.length >= maxLines) return lines;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    if (lines.length >= maxLines) return lines.slice(0, maxLines);
  }
  return lines.slice(0, maxLines);
}

function drawCanvasLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function currentTheme() {
  return state.theme === 'dynamic'
    ? (state.dynamicTheme || paletteForContent())
    : (themeConfig[state.theme] || themeConfig.coastal);
}

function canvasContent() {
  const titleParts = splitHashtags(state.title);
  const descriptionParts = splitHashtags(state.description);
  const title = titleParts.text.replace(/\s+/g, ' ').trim();
  const description = descriptionParts.text.trim();
  const duplicateTitle = Boolean(title && description && (
    title === description || description.startsWith(title) || title.startsWith(description)
  ));
  const sourceLabel = state.sourceLabel || sourceData[state.source].name;
  return {
    title: duplicateTitle ? '' : title,
    description,
    hashtags: mergeHashtags(titleParts.hashtags, descriptionParts.hashtags),
    duplicateTitle,
    source: state.author || sourceLabel,
    byline: sourceLabel ? '来源 · ' + sourceLabel : '',
  };
}

function drawCanvasMedia(ctx, image, cell, radius = 16) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cell.x, cell.y, cell.width, cell.height, radius);
  ctx.clip();
  const scale = cell.fit === 'contain'
    ? Math.min(cell.width / image.width, cell.height / image.height)
    : Math.max(cell.width / image.width, cell.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  ctx.drawImage(
    image,
    cell.x + (cell.width - drawWidth) / 2,
    cell.y + (cell.height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
}

async function downloadAutoCard() {
  const width = 1080;
  const outer = 38;
  const surfacePad = 58;
  const contentX = outer + surfacePad;
  const contentW = width - contentX * 2;
  const density = contentDensity(state.description);
  const bodyFont = density === 'short' ? 48 : density === 'medium' ? 38 : 31;
  const bodyLine = density === 'short' ? 70 : density === 'medium' ? 60 : 52;
  const measure = document.createElement('canvas').getContext('2d');
  const content = canvasContent();
  const role = titleRole(content.title);
  const titleFont = role === 'headline' ? 38 : 26;
  const titleLine = role === 'headline' ? 54 : 38;
  measure.font = `600 ${titleFont}px "Microsoft YaHei", sans-serif`;
  const titleLines = canvasLines(measure, content.title, contentW, role === 'headline' ? 3 : 2);
  measure.font = `500 ${bodyFont}px "Microsoft YaHei", sans-serif`;
  const bodyLines = canvasLines(measure, content.description, contentW);
  const loadedImages = (await Promise.all((state.images || []).slice(0, 12).map(src => loadImage(src).catch(() => null)))).filter(Boolean);
  const mediaLayout = buildAutoMediaLayout(loadedImages, contentW, 18);
  const mediaHeight = mediaLayout.height;
  const titleGap = titleLines.length ? 24 : 0;
  const bylineHeight = content.byline ? 50 : 0;
  const contentHeight = 86 + 36 + titleLines.length * titleLine + titleGap + bodyLines.length * bodyLine + bylineHeight + (mediaHeight ? 38 + mediaHeight : 0) + 110;
  const minimumHeight = loadedImages.length ? 1180 : 820;
  const height = Math.min(7600, Math.max(minimumHeight, outer * 2 + surfacePad * 2 + contentHeight));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const theme = currentTheme();
  const stops = theme.stops;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(.46, stops[1]);
  gradient.addColorStop(1, stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  const dark = theme.dark;
  ctx.fillStyle = dark ? 'rgba(20,21,25,.82)' : 'rgba(255,255,255,.76)';
  ctx.beginPath();
  ctx.roundRect(outer, outer, width - outer * 2, height - outer * 2, 34);
  ctx.fill();
  ctx.fillStyle = dark ? '#fff' : '#17181b';
  ctx.textBaseline = 'top';
  let y = outer + surfacePad;
  let icon = null;
  if (state.icon?.startsWith('data:')) {
    try { icon = await loadImage(state.icon); } catch {}
  }
  if (icon) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(contentX + 23, y + 23, 23, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, contentX, y, 46, 46);
    ctx.restore();
  }
  ctx.font = '700 22px "Microsoft YaHei", sans-serif';
  ctx.fillText(content.source, contentX + 62, y + 9);
  ctx.globalAlpha = .48;
  ctx.textAlign = 'right';
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText(state.sourceLabel || sourceData[state.source].name, width - contentX, y + 12);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  y += 86;
  ctx.globalAlpha = .55;
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText(liveKicker(), contentX, y);
  ctx.globalAlpha = 1;
  y += 36;
  ctx.globalAlpha = .7;
  ctx.font = `600 ${titleFont}px "Microsoft YaHei", sans-serif`;
  y = drawCanvasLines(ctx, titleLines, contentX, y, titleLine);
  ctx.globalAlpha = 1;
  y += 24;
  ctx.font = `500 ${bodyFont}px "Microsoft YaHei", sans-serif`;
  y = drawCanvasLines(ctx, bodyLines, contentX, y, bodyLine);
  if (content.byline) {
    y += 18;
    ctx.globalAlpha = .52;
    ctx.font = '600 18px "Microsoft YaHei", sans-serif';
    ctx.fillText(content.byline, contentX, y);
    ctx.globalAlpha = 1;
    y += 32;
  }
  if (loadedImages.length) y += 38;
  for (const cell of mediaLayout.cells) {
    drawCanvasMedia(ctx, loadedImages[cell.index], {
      ...cell,
      x: contentX + cell.x,
      y: y + cell.y,
    });
  }
  y += mediaHeight;
  const footerY = height - outer - surfacePad - 48;
  ctx.globalAlpha = .42;
  ctx.strokeStyle = dark ? '#fff' : '#17181b';
  ctx.beginPath();
  ctx.moveTo(contentX, footerY - 24);
  ctx.lineTo(width - contentX, footerY - 24);
  ctx.stroke();
  ctx.font = '500 18px Arial, sans-serif';
  ctx.fillText(new Date().toLocaleDateString('zh-CN') + ' · CARDLY', contentX, footerY);
  try {
    const qr = await loadImage(qs('.qr-code').src);
    ctx.globalAlpha = 1;
    ctx.drawImage(qr, width - contentX - 72, footerY - 12, 72, 72);
  } catch {}
  ctx.globalAlpha = .3;
  ctx.textAlign = 'center';
  ctx.font = '600 15px Arial, sans-serif';
  ctx.fillText('CARDLY · 制作卡片', width / 2, height - 26);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  canvas.toBlob(blob => {
    if (!blob) return showToast('导出失败，请重试');
    const link = document.createElement('a');
    link.download = `cardly-auto-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('自适应长图已下载');
  }, 'image/png');
}

async function downloadCard() {
  if (state.ratio === 'auto') return downloadAutoCard();
  const sizes = { square: [1080,1080], wide: [1600,900], portrait: [1080,1350] };
  const [width, height] = sizes[state.ratio];
  const theme = currentTheme();
  const content = canvasContent();
  const light = !theme.dark;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0,0,width,height);
  gradient.addColorStop(0, theme.stops[0]);
  gradient.addColorStop(.46, theme.stops[1]);
  gradient.addColorStop(1, theme.stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,width,height);
  const pad = Math.round(width * .06);
  ctx.fillStyle = light ? '#111216' : '#ffffff';
  ctx.textBaseline = 'top';
  ctx.font = `600 ${Math.round(width*.017)}px Arial, sans-serif`;
  ctx.fillText(content.source, pad, pad);
  ctx.globalAlpha = .72;
  ctx.textAlign = 'right'; ctx.fillText(state.sourceLabel || sourceData[state.source].name, width-pad, pad); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  let image;
  try { image = await loadImage(state.images?.[0] || state.image); } catch { image = null; }
  const isWide = state.ratio === 'wide';
  const imageX = pad, imageY = pad*1.75;
  const imageW = isWide ? width*.51 : width-pad*2;
  const imageH = isWide ? height-pad*2.55 : height*(state.ratio==='portrait' ? .43 : .39);
  if (image) {
    const scale = Math.max(imageW/image.width, imageH/image.height);
    const sw = imageW/scale, sh = imageH/scale;
    ctx.drawImage(image, (image.width-sw)/2, (image.height-sh)/2, sw, sh, imageX, imageY, imageW, imageH);
  } else { ctx.globalAlpha=.16; ctx.fillStyle='#fff'; ctx.fillRect(imageX,imageY,imageW,imageH); ctx.globalAlpha=1; }
  const textX = isWide ? imageX+imageW+pad*.7 : pad;
  const textY = isWide ? imageY+height*.08 : imageY+imageH+pad*.55;
  const textW = isWide ? width-textX-pad : width-pad*2;
  ctx.fillStyle = light ? '#111216' : '#ffffff';
  ctx.globalAlpha=.7; ctx.font = `600 ${Math.round(width*(isWide?.009:.011))}px Arial, sans-serif`; ctx.fillText(liveKicker(), textX, textY); ctx.globalAlpha=1;
  ctx.globalAlpha=.68;
  ctx.font = `600 ${Math.round(width*(isWide?.012:.018))}px "Microsoft YaHei", sans-serif`;
  const afterPublisher = content.title
    ? wrapText(ctx,content.title,textX,textY+pad*.45,textW,Math.round(width*(isWide?.017:.026)),2)
    : textY + pad * .34;
  ctx.globalAlpha=1;
  ctx.font=`560 ${Math.round(width*(isWide?.024:.04))}px "Microsoft YaHei", sans-serif`;
  const afterBody = wrapText(ctx,content.description,textX,afterPublisher+pad*.22,textW,Math.round(width*(isWide?.032:.052)),isWide?4:3);
  if (content.byline) {
    ctx.globalAlpha = .58;
    ctx.font = '600 ' + Math.round(width*(isWide?.01:.014)) + 'px "Microsoft YaHei", sans-serif';
    ctx.fillText(content.byline, textX, afterBody + pad * .18);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle=light?'#111216':'#fff'; ctx.globalAlpha=.6; ctx.beginPath(); ctx.moveTo(pad,height-pad*.85); ctx.lineTo(width-pad,height-pad*.85); ctx.stroke();
  ctx.font=`500 ${Math.round(width*.012)}px Arial, sans-serif`; ctx.fillText('CARDLY · SHARE BEAUTIFULLY',pad,height-pad*.55); ctx.textAlign='right'; ctx.fillText('↗',width-pad,height-pad*.62); ctx.globalAlpha=1;
  canvas.toBlob(blob => {
    if (!blob) return showToast('导出失败，请重试');
    const link = document.createElement('a');
    link.download = `cardly-${state.source}-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob); link.click(); URL.revokeObjectURL(link.href);
    showToast('PNG 已下载');
  }, 'image/png');
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function imageElementDataUrl(image) {
  const source = image.currentSrc || image.src;
  if (!source || source.startsWith('data:')) return source;
  if (!image.complete || !image.naturalWidth) return "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
  try {
    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {}
  try {
    const response = await fetch(source, { credentials: 'same-origin' });
    if (!response.ok) return source;
    return await blobToDataUrl(await response.blob());
  } catch {
    return source;
  }
}

async function cloneCardForExport(element) {
  const clone = element.cloneNode(true);
  const sourceNodes = [element, ...element.querySelectorAll('*')];
  const cloneNodes = [clone, ...clone.querySelectorAll('*')];
  sourceNodes.forEach((sourceNode, index) => {
    const cloneNode = cloneNodes[index];
    const computed = getComputedStyle(sourceNode);
    for (const property of computed) {
      cloneNode.style.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property));
    }
    cloneNode.style.animation = 'none';
    cloneNode.style.transition = 'none';
  });
  const sourceImages = [...element.querySelectorAll('img')];
  const cloneImages = [...clone.querySelectorAll('img')];
  await Promise.all(sourceImages.map(async (image, index) => {
    const source = await imageElementDataUrl(image);
    if (source) cloneImages[index].src = source;
  }));
  return clone;
}

async function rasterizePreviewCard() {
  await document.fonts?.ready;
  const element = qs('#share-card');
  const rect = element.getBoundingClientRect();
  const sizes = { square: [1080, 1080], wide: [1600, 900], portrait: [1080, 1350] };
  const [width, height] = state.ratio === 'auto'
    ? [1080, Math.max(1, Math.round(1080 * rect.height / rect.width))]
    : sizes[state.ratio];
  const clone = await cloneCardForExport(element);
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.margin = '0';
  clone.style.transform = 'none';
  const wrapper = document.createElement('div');
  wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  wrapper.style.width = rect.width + 'px';
  wrapper.style.height = rect.height + 'px';
  wrapper.style.margin = '0';
  wrapper.appendChild(clone);
  const serialized = new XMLSerializer().serializeToString(wrapper);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}"><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  let rendered;
  try {
    rendered = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('预览栅格化失败'));
      image.src = svgUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(rendered, 0, 0, width, height);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG 编码失败')), 'image/png'));
  } finally {
    rendered = null;
  }
}

async function downloadPreviewCard() {
  const buttons = qsa('[data-download]');
  buttons.forEach(button => button.disabled = true);
  try {
    const blob = await rasterizePreviewCard();
    const link = document.createElement('a');
    link.download = `cardly-${state.ratio}-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1200);
    showToast('已按实时预览导出高清 PNG');
  } catch (error) {
    console.error(error);
    showToast('导出失败，请重试');
  } finally {
    buttons.forEach(button => button.disabled = false);
  }
}

qsa('[data-download]').forEach(button => button.addEventListener('click', downloadPreviewCard));
updateCard();
