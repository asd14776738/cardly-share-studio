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
  if (url.includes('weibo.com/ajax/statuses/show') && url.includes('fallbackid')) return new Response('', { status: 403 });
  if (url.includes('m.weibo.cn/statuses/show') && url.includes('fallbackid')) return new Response('', { status: 403 });
  if (url.startsWith('https://weibo.com/user/fallbackid')) return html(`
    <meta property="og:title" content="Fallback Weibo Post">
    <meta property="og:description" content="Fallback weibo public content">
    <meta property="og:image" content="https://wx1.sinaimg.cn/large/fallback.jpg">
    <div>Sina Visitor System</div>`);
  if (url.includes('weibo.com/ajax/statuses/show')) return json({
    text_raw: '微博正文内容',
    user: { screen_name: '微博作者' },
    attitudes_count: 3482,
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
    <div id="js_content"><p>${'微信文章正文。'.repeat(180)}</p><img data-src="https://mmbiz.qpic.cn/body.jpg"></div><script></script>`);
  if (url.startsWith('https://www.xiaohongshu.com/discovery/item/note-single')) return html(`
    <meta property="og:image" content="https://sns-avatar-qc.xhscdn.com/avatar.jpg">
    <meta property="twitter:image" content="https://sns-webpic-qc.xhscdn.com/recommend.jpg">
    <script>window.__INITIAL_STATE__={"note":{"noteId":"note-single","title":"Single image note","desc":"Only the post image should remain","user":{"nickname":"Author"},"imageList":[{"urlDefault":"https://sns-webpic-qc.xhscdn.com/post-default.jpg?imageView2=2&w=1080","urlPre":"https://sns-webpic-hw.xhscdn.com/post-preview.jpg?imageView2=2&w=360","infoList":[{"imageScene":"WB_DFT","url":"https://sns-webpic-qc.xhscdn.com/post-scene-default.jpg"},{"imageScene":"WB_PRV","url":"https://sns-webpic-hw.xhscdn.com/post-scene-preview.jpg"}]}],"images":[{"url":"https://sns-webpic-qc.xhscdn.com/post-legacy-copy.jpg"}]}};</script>`);
  if (url.startsWith('https://www.xiaohongshu.com/discovery/item/note1') || url.startsWith('https://xhslink.com/a/note1')) return html(`
    <script>window.__INITIAL_STATE__={"note":{"noteId":"note1","title":"小红书标题","desc":"小红书正文","user":{"nickname":"小红书作者"},"interactInfo":{"likedCount":"2.6\u4e07"},"imageList":[{"urlDefault":"https://sns-webpic-qc.xhscdn.com/1.jpg"},{"urlDefault":"https://sns-webpic-qc.xhscdn.com/2.jpg"}]}};</script>`);
  if (url.startsWith('https://web.okjike.com/originalPost/post1')) return html(`
    <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"post":{"id":"post1","content":"即刻正文","creator":{"screenName":"即刻作者"},"pictures":[{"url":"https://cdn.okjike.com/1.jpg"}]}}}}</script>`);
  if (url.startsWith('https://music.163.com/api/song/detail/')) return json({
    songs: [{ name: '网易云歌曲', artists: [{ name: '歌手甲' }], album: { name: '专辑甲', picUrl: 'https://p1.music.126.net/cover.jpg' } }],
  });
  if (url.startsWith('https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg')) return json({
    data: [{ songname: 'QQ歌曲', singer: [{ name: '歌手乙' }], albumname: '专辑乙', albummid: 'ALBUMMID' }],
  });
  if (url.startsWith('https://t.me/channel/123?')) return html(`
    <a class="tgme_widget_message_owner_name"><span>频道作者</span></a>
    <div class="tgme_widget_message_text">Telegram 标题<br><br>Telegram 正文</div>
    <div class="tgme_widget_message_reactions"><i class="emoji" style="background-image:url('//telegram.org/emoji/thumb.png')"></i></div>
    <a class="tgme_widget_message_photo_wrap" style="background-image:url('https://cdn.telegram.org/photo.jpg')"></a>`);
  if (url.startsWith('https://t.me/xhqcankao/30761?')) return html(`
    <meta property="og:title" content="Telegram Widget">
    <a class="tgme_widget_message_owner_name"><span>风向旗参考快讯</span></a>
    <div class="tgme_widget_message_text">长鑫上市将批量造富 员工每人可分超百万<br><br>备受投资者关注的存储巨头长鑫科技，将进行新股网下申购和网上申购。<br><br>—— 中新经纬</div>
    <div class="tgme_widget_message_reactions">
      <i class="emoji" style="background-image:url('//telegram.org/emoji/thumb.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/clown.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/fire.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/heart.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/poop.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/banana.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/finger.png')"></i>
      <i class="emoji" style="background-image:url('//telegram.org/emoji/cry.png')"></i>
    </div>
    <span class="tgme_widget_message_views">3.1K</span>`);
  if (url.startsWith('https://music.apple.com/')) return html(`
    <meta property="og:title" content="Apple Music Song">
    <meta property="og:description" content="Artist · Album">
    <meta property="og:image" content="https://is1-ssl.mzstatic.com/image.jpg">`);
  if (url.includes('cdn.syndication.twimg.com/tweet-result')) return json({
    text: 'X 正文 https://t.co/media',
    user: { name: 'X作者', screen_name: 'xauthor' },
    favorite_count: 12700,
    mediaDetails: [{ type: 'photo', media_url_https: 'https://pbs.twimg.com/1.jpg' }, { type: 'photo', media_url_https: 'https://pbs.twimg.com/2.jpg' }],
  });
  if (url.startsWith('https://open.spotify.com/oembed')) return json({
    title: 'Spotify Song', author_name: 'Spotify Artist', thumbnail_url: 'https://i.scdn.co/cover.jpg',
  });
  if (url.startsWith('https://www.instagram.com/p/DacpRzeMiMA/embed/captioned/')) return html(`
    <meta property="og:title" content="Instagram &amp;#x7528;&amp;#x6237;: Houston Rockets T&amp;#xfc;rkiye">
    <meta property="og:image" content="https://scontent.cdninstagram.com/alperen.jpg">
    <div class="Caption"><a data-log-event="captionProfileClick">rocketstur</a><br><br>Bu gece Alperen &#x15e;eng&#xfc;n f&#x131;rt&#x131;nas&#x131; Sinan Erdem Spor Salonu&#x2019;nda esecek!<br><br>Ba&#x15f;ar&#x131;lar Milli Tak&#x131;m &#x1f1f9;&#x1f1f7;<div class="CaptionComments">View all 37 comments</div></div>`);
  if (url.startsWith('https://www.instagram.com/reel/CODE2/embed/captioned/')) return new Response('', { status: 403 });
  if (url.startsWith('https://www.instagram.com/reel/CODE2/embed/')) return html('<title>Log in • Instagram</title>');
  if (url.startsWith('https://www.instagram.com/reel/CODE2/')) return html(`
    <script data-sjs>{"post":{"shortcode":"CODE2","caption":{"text":"Instagram fallback caption"},"owner":{"username":"fallback_author"},"video_view_count":45678,"display_url":"https://scontent.cdninstagram.com/fallback.jpg"}}</script>`);
  if (url.startsWith('https://www.instagram.com/reel/CODE/embed/captioned/')) return html(`
    <meta property="og:title" content="Instagram Post">
    <meta property="og:description" content="Instagram 正文">
    <meta property="og:image" content="https://scontent.cdninstagram.com/1.jpg">`);
  if (url.startsWith('https://www.threads.com/@author/post/code')) return html(`
    <meta property="og:title" content="Threads Post">
    <script type="application/json">{"post":{"code":"code","caption":{"text":"Threads 正文"},"user":{"username":"author"},"like_count":918,"image_versions2":{"candidates":[{"url":"https://scontent.cdninstagram.com/thread.jpg"}]}}}</script>`);
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
  if (url.startsWith('https://v.douyin.com/u9hdlMEybs0/')) {
    const router = { loaderData: { page: { videoInfoRes: { item_list: [{ aweme_id: '7565171239478005002', desc: '\u5b58\u4e00\u7ec4\u53cd\u5b63\u8282\u7684\u62a4\u773c\u58c1\u7eb8\u3002', author: { nickname: '\u58c1\u7eb8\u4f5c\u8005' }, statistics: { play_count: 86520, digg_count: 7314 }, video: { origin_cover: { url_list: ['https://p3.douyinpic.com/wallpaper-cover.jpg'] } } }] } } } };
    return html('<script>window._ROUTER_DATA = ' + JSON.stringify(router) + '</script>');
  }
  if (url.startsWith('https://www.douyin.com/video/789')) return html('<title>在抖音记录美好生活 - 抖音</title>');
  if (url.startsWith('https://www.iesdouyin.com/share/video/789/')) {
    const router = { loaderData: { page: { videoInfoRes: { filter_list: [{ aweme_id: '789', filter_reason: 'author_invalid&status_audit_self_see' }], item_list: [] } } } };
    return html('<script>window._ROUTER_DATA = ' + JSON.stringify(router) + '</script>');
  }
  if (url.startsWith('https://www.douyin.com/video/456')) return html('<title>抖音</title>');
  if (url.startsWith('https://www.iesdouyin.com/share/video/456/')) {
    const router = { loaderData: { page: { videoInfoRes: { item_list: [{ aweme_id: '456', desc: '抖音分享页正文', author: { nickname: '分享页作者' }, video: { cover: { url_list: ['https://p3.douyinpic.com/share-cover.jpg'] } }, statistics: { play_count: 24001, digg_count: 1600 } }] } } } };
    return html('<script>window._ROUTER_DATA = ' + JSON.stringify(router) + '</script>');
  }
  if (url.startsWith('https://www.douyin.com/video/123') || url.startsWith('https://v.douyin.com/short123')) {
    const state = encodeURIComponent(JSON.stringify({ aweme: {
      aweme_id: '123',
      desc: '抖音正文',
      author: { nickname: '抖音作者' },
      statistics: { play_count: 58700, digg_count: 4200 },
      video: {
        origin_cover: { url_list: ['https://p3.douyinpic.com/origin-high.jpg', 'https://p9.douyinpic.com/origin-backup.jpg'] },
        cover: { url_list: ['https://p3.douyinpic.com/cover.jpg'] },
        dynamic_cover: { url_list: ['https://p3.douyinpic.com/dynamic.webp'] },
      },
    } }));
    return html('<meta property="og:image" content="https://p3.douyinpic.com/meta-cover.jpg"><script id="RENDER_DATA">' + state + '</script>');
  }
  if (url.startsWith('https://www.douyin.com/note/321')) {
    const state = encodeURIComponent(JSON.stringify({ aweme: {
      aweme_id: '321',
      desc: '抖音图文正文',
      author: { nickname: '图文作者' },
      images: [
        { url_list: ['https://p3.douyinpic.com/note-1.jpg', 'https://p9.douyinpic.com/note-1-backup.jpg'] },
        { url_list: ['https://p3.douyinpic.com/note-2.jpg', 'https://p9.douyinpic.com/note-2-backup.jpg'] },
        { url_list: ['https://p3.douyinpic.com/note-3.jpg', 'https://p9.douyinpic.com/note-3-backup.jpg'] },
      ],
      video: { cover: { url_list: ['https://p3.douyinpic.com/irrelevant-cover.jpg'] } },
    } }));
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
  ['Weibo metadata fallback', 'https://weibo.com/user/fallbackid', { platform: 'weibo', strategy: 'weibo-login-wall', title: 'Fallback Weibo Post', images: 1, status: 'partial' }],
  ['Xiaohongshu single body image', 'https://www.xiaohongshu.com/discovery/item/note-single', { platform: 'xiaohongshu', strategy: 'xiaohongshu-initial-state', title: 'Single image note', images: 1, imageIncludes: 'post-default.jpg' }],
  ['Instagram script fallback', 'https://www.instagram.com/reel/CODE2/', { platform: 'instagram', strategy: 'instagram-json-state', title: '@fallback_author on Instagram', author: 'fallback_author', images: 1, metricType: 'views', metricCount: 45678 }],
  ['Instagram 十六进制实体解码', 'https://www.instagram.com/p/DacpRzeMiMA/', { platform: 'instagram', strategy: 'instagram-embed', title: '@rocketstur on Instagram', author: 'rocketstur', descriptionIncludes: 'Şengün fırtınası', descriptionExcludes: ['&#x', 'View all 37 comments'], images: 1 }],

  ['知乎', 'https://www.zhihu.com/question/100/answer/200', { platform: 'zhihu', strategy: 'zhihu-answer-api', title: '知乎问题标题', author: '知乎作者', images: 1 }],
  ['微博', 'https://m.weibo.cn/status/post1', { platform: 'weibo', strategy: 'weibo-public-json', titleEmpty: true, author: '微博作者', images: 2, metricType: 'likes', metricCount: 3482 }],
  ['微信', 'https://mp.weixin.qq.com/s/abc', { platform: 'wechat', strategy: 'wechat-article-html', title: '微信文章标题', author: '公众号作者', images: 2, minutes: 4 }],
  ['小红书', 'https://www.xiaohongshu.com/discovery/item/note1', { platform: 'xiaohongshu', strategy: 'xiaohongshu-initial-state', title: '小红书标题', author: '小红书作者', images: 2, metricType: 'likes', metricCount: 26000 }],
  ['即刻', 'https://web.okjike.com/originalPost/post1', { platform: 'jike', strategy: 'jike-ssr-state', author: '即刻作者', images: 1 }],
  ['网易云音乐', 'https://y.music.163.com/m/song?id=347230', { platform: 'netease_music', strategy: 'netease-song-api', title: '网易云歌曲', author: '歌手甲', images: 1 }],
  ['QQ音乐', 'https://y.qq.com/n/ryqq/songDetail/SONGMID', { platform: 'qq_music', strategy: 'qqmusic-song-api', title: 'QQ歌曲', author: '歌手乙', images: 1 }],
  ['Telegram', 'https://t.me/s/channel/123', { platform: 'telegram', strategy: 'telegram-embed', title: 'Telegram 标题', author: '频道作者', images: 1 }],
  ['Telegram 反应表情不是配图', 'https://t.me/xhqcankao/30761', { platform: 'telegram', strategy: 'telegram-embed', title: '长鑫上市将批量造富 员工每人可分超百万', author: '风向旗参考快讯', descriptionIncludes: '备受投资者关注', images: 0, metricType: 'views', metricCount: 3100 }],
  ['Apple Music', 'https://music.apple.com/cn/album/test/123', { platform: 'apple_music', strategy: 'applemusic-structured-metadata', title: 'Apple Music Song', images: 1 }],
  ['X', 'https://x.com/xauthor/status/2075492877380063586', { platform: 'x', strategy: 'x-syndication', title: 'X作者 (@xauthor) on X', author: '@xauthor', images: 2, metricType: 'likes', metricCount: 12700 }],
  ['Spotify', 'https://open.spotify.com/track/trackid', { platform: 'spotify', strategy: 'spotify-oembed', title: 'Spotify Song', author: 'Spotify Artist', images: 1 }],
  ['Instagram', 'https://www.instagram.com/reel/CODE/', { platform: 'instagram', strategy: 'instagram-embed', title: 'Instagram Post', images: 1 }],
  ['Threads', 'https://www.threads.com/@author/post/code', { platform: 'threads', strategy: 'threads-json-state', title: '@author on Threads', author: 'author', images: 1, metricType: 'likes', metricCount: 918 }],
  ['豆瓣', 'https://movie.douban.com/subject/1292052/', { platform: 'douban', strategy: 'douban-rexxar-api', title: '豆瓣电影标题', author: '导演甲', images: 1 }],
  ['抖音视频单封面', 'https://www.douyin.com/video/123', { platform: 'douyin', strategy: 'douyin-render-data', title: '抖音正文', author: '抖音作者', images: 1, imageIncludes: 'origin-high.jpg', metricType: 'views', metricCount: 58700 }],
  ['抖音图文全部图片', 'https://www.douyin.com/note/321', { platform: 'douyin', strategy: 'douyin-render-data', title: '抖音图文正文', author: '图文作者', images: 3 }],
  ['ChatGPT', 'https://chatgpt.com/share/shareid', { platform: 'chatgpt', strategy: 'chatgpt-shared-page', title: 'ChatGPT 分享', images: 1 }],
  ['Kimi', 'https://kimi.com/share/shareid', { platform: 'kimi', strategy: 'kimi-shared-page', title: 'Kimi 分享', images: 1 }],
  ['小红书短链', 'https://xhslink.com/a/note1', { platform: 'xiaohongshu', strategy: 'xiaohongshu-initial-state', title: '小红书标题', images: 2 }],
  ['网易云短链', 'https://163cn.tv/song347230', { platform: 'netease_music', strategy: 'netease-metadata', title: '网易云短链歌曲', images: 1 }],
  ['豆瓣移动图书', 'https://m.douban.com/book/subject/1084336/', { platform: 'douban', strategy: 'douban-rexxar-api', title: '豆瓣图书标题', author: '作者乙', images: 1 }],
  ['抖音短链', 'https://v.douyin.com/short123', { platform: 'douyin', strategy: 'douyin-render-data', title: '抖音正文', author: '抖音作者', images: 1 }],
  ['抖音分享页', 'https://www.douyin.com/video/456', { platform: 'douyin', strategy: 'douyin-share-router-data', title: '抖音分享页正文', author: '分享页作者', images: 1, metricType: 'views', metricCount: 24001 }],
  ['\u6296\u97f3\u771f\u5b9e\u77ed\u94fe\u8def\u7531\u6570\u636e', 'https://v.douyin.com/u9hdlMEybs0/', { platform: 'douyin', strategy: 'douyin-share-router-data', title: '\u5b58\u4e00\u7ec4\u53cd\u5b63\u8282\u7684\u62a4\u773c\u58c1\u7eb8\u3002', author: '\u58c1\u7eb8\u4f5c\u8005', images: 1, metricType: 'views', metricCount: 86520 }],
  ['抖音受限作品', 'https://www.douyin.com/video/789', { platform: 'douyin', strategy: 'douyin-restricted', title: '抖音作品暂不可访问', images: 0, status: 'unavailable' }],
];

for (const [name, url, expected] of cases) {
  const result = await extract(url);
  assert.equal(result.platform, expected.platform, name + ' platform');
  assert.equal(result.strategy, expected.strategy, name + ' strategy');
  if (expected.title) assert.equal(result.title, expected.title, name + ' title');
  if (expected.titleEmpty) assert.equal(result.title, '', name + ' empty title');
  if (expected.author) assert.equal(result.author, expected.author, name + ' author');
  if (expected.descriptionIncludes) assert.ok(result.description.includes(expected.descriptionIncludes), name + ' description');
  if (expected.descriptionExcludes) for (const value of expected.descriptionExcludes) assert.ok(!result.description.includes(value), name + ' description excludes ' + value);
  if (expected.status) assert.equal(result.status, expected.status, name + ' status');
  assert.equal(result.imageCount, expected.images, name + ' image count');
  if (expected.imageIncludes) assert.ok(result.image.includes(expected.imageIncludes), name + ' preferred image');
  if (expected.metricType) assert.equal(result.metricType, expected.metricType, name + ' metric type');
  if (expected.metricCount !== undefined) assert.equal(result.metricCount, expected.metricCount, name + ' metric count');
  assert.ok(Number.isInteger(result.readingMinutes) && result.readingMinutes >= 1, name + ' reading minutes');
  if (expected.minutes) assert.equal(result.readingMinutes, expected.minutes, name + ' source reading minutes');
  assert.ok(result.description || name === '即刻' || expected.status === 'unavailable', name + ' description');
  console.log('PASS', name, result.strategy, result.imageCount);
}
