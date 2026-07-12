import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';

const html = body => new Response(body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
const json = value => new Response(JSON.stringify(value), { status: 200, headers: { 'content-type': 'application/json' } });

globalThis.fetch = async input => {
  const url = String(input);
  if (url.startsWith('https://api.zhihu.com/answers/200')) return json({
    content: '<p>知乎回答正文，包含足够的信息。</p><img src="https://pic.zhimg.com/a.jpg">',
    question: { title: '知乎问题标题' },
    author: { name: '知乎作者' },
  });
  if (url.includes('weibo.com/ajax/statuses/show')) return json({
    text_raw: '微博正文内容',
    user: { screen_name: '微博作者' },
    pic_infos: {
      a: { largest: { url: 'https://wx1.sinaimg.cn/large/a.jpg' } },
      b: { largest: { url: 'https://wx2.sinaimg.cn/large/b.jpg' } },
    },
  });
  if (url.startsWith('https://www.zhihu.com/question/100/answer/200')) return html(`
    <meta property="og:title" content="备用知乎标题">
    <script id="js-initialData" type="text/json">{"initialState":{"entities":{"questions":{"100":{"title":"知乎问题标题","detail":"问题详情"}},"answers":{"200":{"content":"<p>知乎回答正文，包含足够的信息。</p><img src=\\"https://pic.zhimg.com/a.jpg\\">","author":{"name":"知乎作者"}}}}}}</script>`);
  if (url.startsWith('https://mp.weixin.qq.com/s/abc')) return html(`
    <meta property="og:title" content="微信备用标题">
    <script>var msg_title = '微信文章标题'.html(false); var msg_desc = '微信摘要'; var nickname = '公众号作者'; var msg_cdn_url = 'https://mmbiz.qpic.cn/cover.jpg';</script>
    <div id="js_content"><p>微信文章正文。</p><img data-src="https://mmbiz.qpic.cn/body.jpg"></div><script></script>`);
  if (url.startsWith('https://www.xiaohongshu.com/discovery/item/note1') || url.startsWith('https://xhslink.com/a/note1')) return html(`
    <script>window.__INITIAL_STATE__={"note":{"noteId":"note1","title":"小红书标题","desc":"小红书正文","user":{"nickname":"小红书作者"},"imageList":[{"urlDefault":"https://sns-webpic-qc.xhscdn.com/1.jpg"},{"urlDefault":"https://sns-webpic-qc.xhscdn.com/2.jpg"}]}};</script>`);
  if (url.startsWith('https://web.okjike.com/originalPost/post1')) return html(`
    <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"post":{"id":"post1","content":"即刻正文","creator":{"screenName":"即刻作者"},"pictures":[{"url":"https://cdn.okjike.com/1.jpg"}]}}}}</script>`);
  if (url.startsWith('https://music.163.com/api/song/detail/')) return json({
    songs: [{ name: '网易云歌曲', artists: [{ name: '歌手甲' }], album: { name: '专辑甲', picUrl: 'https://p1.music.126.net/cover.jpg' } }],
  });
  if (url.startsWith('https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg')) return json({
    data: [{ songname: 'QQ歌曲', singer: [{ name: '歌手乙' }], albumname: '专辑乙', albummid: 'ALBUMMID' }],
  });
  if (url.startsWith('https://t.me/channel/123?')) return html(`
    <a class="tgme_widget_message_author_name"><span>频道作者</span></a>
    <div class="tgme_widget_message_text">Telegram 正文</div>
    <a style="background-image:url('https://cdn.telegram.org/photo.jpg')"></a>`);
  if (url.startsWith('https://music.apple.com/')) return html(`
    <meta property="og:title" content="Apple Music Song">
    <meta property="og:description" content="Artist · Album">
    <meta property="og:image" content="https://is1-ssl.mzstatic.com/image.jpg">`);
  if (url.includes('cdn.syndication.twimg.com/tweet-result')) return json({
    text: 'X 正文 https://t.co/media',
    user: { name: 'X作者', screen_name: 'xauthor' },
    mediaDetails: [{ type: 'photo', media_url_https: 'https://pbs.twimg.com/1.jpg' }, { type: 'photo', media_url_https: 'https://pbs.twimg.com/2.jpg' }],
  });
  if (url.startsWith('https://open.spotify.com/oembed')) return json({
    title: 'Spotify Song', author_name: 'Spotify Artist', thumbnail_url: 'https://i.scdn.co/cover.jpg',
  });
  if (url.startsWith('https://www.instagram.com/reel/CODE/embed/captioned/')) return html(`
    <meta property="og:title" content="Instagram Post">
    <meta property="og:description" content="Instagram 正文">
    <meta property="og:image" content="https://scontent.cdninstagram.com/1.jpg">`);
  if (url.startsWith('https://www.threads.com/@author/post/code')) return html(`
    <meta property="og:title" content="Threads Post">
    <script type="application/json">{"post":{"code":"code","caption":{"text":"Threads 正文"},"user":{"username":"author"},"image_versions2":{"candidates":[{"url":"https://scontent.cdninstagram.com/thread.jpg"}]}}}</script>`);
  if (url.startsWith('https://m.douban.com/rexxar/api/v2/book/1084336')) return json({
    title: '豆瓣图书标题', intro: '豆瓣图书简介', author: ['作者乙'],
    pic: { large: 'https://img1.doubanio.com/book.jpg' },
  });
  if (url.startsWith('https://m.douban.com/rexxar/api/v2/movie/1292052')) return json({
    title: '豆瓣电影标题', intro: '豆瓣条目简介', directors: [{ name: '导演甲' }],
    actors: [{ name: '演员甲' }], pic: { large: 'https://img1.doubanio.com/poster.jpg' },
  });
  if (url.startsWith('https://movie.douban.com/subject/1292052/')) return html(`
    <meta property="og:title" content="豆瓣电影标题"><meta property="og:image" content="https://img1.doubanio.com/poster.jpg">
    <span property="v:summary">豆瓣条目简介</span><a rel="v:directedBy">导演甲</a>`);
  if (url.startsWith('https://www.douyin.com/video/456')) return html('<title>抖音</title>');
  if (url.startsWith('https://www.iesdouyin.com/share/video/456/')) {
    const router = { loaderData: { page: { videoInfoRes: { item_list: [{ aweme_id: '456', desc: '抖音分享页正文', author: { nickname: '分享页作者' }, video: { cover: { url_list: ['https://p3.douyinpic.com/share-cover.jpg'] } } }] } } } };
    return html('<script>window._ROUTER_DATA = ' + JSON.stringify(router) + '</script>');
  }
  if (url.startsWith('https://www.douyin.com/video/123') || url.startsWith('https://v.douyin.com/short123')) {
    const state = encodeURIComponent(JSON.stringify({ aweme: { aweme_id: '123', desc: '抖音正文', author: { nickname: '抖音作者' }, video: { cover: { url_list: ['https://p3.douyinpic.com/cover.jpg'] } } } }));
    return html('<script id="RENDER_DATA">' + state + '</script>');
  }
  if (url.startsWith('https://163cn.tv/song347230')) return html('<title>网易云短链歌曲</title><meta name=description content=网易云短链摘要><meta property=og:image content=https://p1.music.126.net/cover.jpg>');
  if (url.startsWith('https://chatgpt.com/share/')) return html(`
    <meta property="og:title" content="ChatGPT 分享"><meta property="og:description" content="共享对话摘要"><meta property="og:image" content="https://cdn.openai.com/share.png">`);
  if (url.startsWith('https://kimi.com/share/')) return html(`
    <meta property="og:title" content="Kimi 分享"><meta property="og:description" content="Kimi 共享内容"><meta property="og:image" content="https://statics.moonshot.cn/share.png">`);
  throw new Error('Unexpected upstream request: ' + url);
};

async function extract(target) {
  const response = await worker.fetch(new Request('https://cardly.test/api/extract?url=' + encodeURIComponent(target)));
  if (response.status !== 200) throw new Error(await response.text());
  return response.json();
}

const cases = [
  ['知乎', 'https://www.zhihu.com/question/100/answer/200', { platform: 'zhihu', strategy: 'zhihu-answer-api', title: '知乎问题标题', author: '知乎作者', images: 1 }],
  ['微博', 'https://m.weibo.cn/status/post1', { platform: 'weibo', strategy: 'weibo-public-json', title: '微博作者 的微博', author: '微博作者', images: 2 }],
  ['微信', 'https://mp.weixin.qq.com/s/abc', { platform: 'wechat', strategy: 'wechat-article-html', title: '微信文章标题', author: '公众号作者', images: 2 }],
  ['小红书', 'https://www.xiaohongshu.com/discovery/item/note1', { platform: 'xiaohongshu', strategy: 'xiaohongshu-initial-state', title: '小红书标题', author: '小红书作者', images: 2 }],
  ['即刻', 'https://web.okjike.com/originalPost/post1', { platform: 'jike', strategy: 'jike-ssr-state', author: '即刻作者', images: 1 }],
  ['网易云音乐', 'https://y.music.163.com/m/song?id=347230', { platform: 'netease_music', strategy: 'netease-song-api', title: '网易云歌曲', author: '歌手甲', images: 1 }],
  ['QQ音乐', 'https://y.qq.com/n/ryqq/songDetail/SONGMID', { platform: 'qq_music', strategy: 'qqmusic-song-api', title: 'QQ歌曲', author: '歌手乙', images: 1 }],
  ['Telegram', 'https://t.me/s/channel/123', { platform: 'telegram', strategy: 'telegram-embed', author: '频道作者', images: 1 }],
  ['Apple Music', 'https://music.apple.com/cn/album/test/123', { platform: 'apple_music', strategy: 'applemusic-structured-metadata', title: 'Apple Music Song', images: 1 }],
  ['X', 'https://x.com/xauthor/status/2075492877380063586', { platform: 'x', strategy: 'x-syndication', title: 'X作者 (@xauthor) on X', author: '@xauthor', images: 2 }],
  ['Spotify', 'https://open.spotify.com/track/trackid', { platform: 'spotify', strategy: 'spotify-oembed', title: 'Spotify Song', author: 'Spotify Artist', images: 1 }],
  ['Instagram', 'https://www.instagram.com/reel/CODE/', { platform: 'instagram', strategy: 'instagram-embed', title: 'Instagram Post', images: 1 }],
  ['Threads', 'https://www.threads.com/@author/post/code', { platform: 'threads', strategy: 'threads-json-state', title: '@author on Threads', author: 'author', images: 1 }],
  ['豆瓣', 'https://movie.douban.com/subject/1292052/', { platform: 'douban', strategy: 'douban-rexxar-api', title: '豆瓣电影标题', author: '导演甲', images: 1 }],
  ['抖音', 'https://www.douyin.com/video/123', { platform: 'douyin', strategy: 'douyin-render-data', title: '抖音正文', author: '抖音作者', images: 1 }],
  ['ChatGPT', 'https://chatgpt.com/share/shareid', { platform: 'chatgpt', strategy: 'chatgpt-shared-page', title: 'ChatGPT 分享', images: 1 }],
  ['Kimi', 'https://kimi.com/share/shareid', { platform: 'kimi', strategy: 'kimi-shared-page', title: 'Kimi 分享', images: 1 }],
  ['小红书短链', 'https://xhslink.com/a/note1', { platform: 'xiaohongshu', strategy: 'xiaohongshu-initial-state', title: '小红书标题', images: 2 }],
  ['网易云短链', 'https://163cn.tv/song347230', { platform: 'netease_music', strategy: 'netease-metadata', title: '网易云短链歌曲', images: 1 }],
  ['豆瓣移动图书', 'https://m.douban.com/book/subject/1084336/', { platform: 'douban', strategy: 'douban-rexxar-api', title: '豆瓣图书标题', author: '作者乙', images: 1 }],
  ['抖音短链', 'https://v.douyin.com/short123', { platform: 'douyin', strategy: 'douyin-render-data', title: '抖音正文', author: '抖音作者', images: 1 }],
  ['抖音分享页', 'https://www.douyin.com/video/456', { platform: 'douyin', strategy: 'douyin-share-router-data', title: '抖音分享页正文', author: '分享页作者', images: 1 }],
];

for (const [name, url, expected] of cases) {
  const result = await extract(url);
  assert.equal(result.platform, expected.platform, name + ' platform');
  assert.equal(result.strategy, expected.strategy, name + ' strategy');
  if (expected.title) assert.equal(result.title, expected.title, name + ' title');
  if (expected.author) assert.equal(result.author, expected.author, name + ' author');
  assert.equal(result.imageCount, expected.images, name + ' image count');
  assert.ok(result.description || name === '即刻', name + ' description');
  console.log('PASS', name, result.strategy, result.imageCount);
}
