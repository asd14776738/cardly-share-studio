import assert from 'node:assert/strict';
import { mergeHashtags, splitHashtags } from '../hashtags.js';

const douyin = splitHashtags('五大AI深陷杀猪盘，居然没有一个能够看破#ai新星计划#ai#人工智能 #AICG');
assert.equal(douyin.text, '五大AI深陷杀猪盘，居然没有一个能够看破');
assert.deepEqual(douyin.hashtags, ['#ai新星计划', '#ai', '#人工智能', '#AICG']);

const spaced = splitHashtags('存一组反季节的护眼壁纸。# 壁纸 # 电脑壁纸 # 平板壁纸');
assert.equal(spaced.text, '存一组反季节的护眼壁纸。');
assert.deepEqual(spaced.hashtags, ['#壁纸', '#电脑壁纸', '#平板壁纸']);

const xiaohongshu = splitHashtags('周末看海 #海边[话题]# #旅行[话题]#');
assert.equal(xiaohongshu.text, '周末看海');
assert.deepEqual(xiaohongshu.hashtags, ['#海边', '#旅行']);

assert.deepEqual(mergeHashtags(['#AI', '#设计'], ['#ai', '#生活']), ['#AI', '#设计', '#生活']);
console.log('Hashtag hierarchy tests passed.');
