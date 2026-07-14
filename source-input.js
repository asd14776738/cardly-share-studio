const PLATFORM_RULES = [
  [/douyin\.com$|iesdouyin\.com$/i, '\u6296\u97f3'],
  [/xiaohongshu\.com$|xhslink\.com$/i, '\u5c0f\u7ea2\u4e66'],
  [/weibo\.com$|weibo\.cn$/i, '\u5fae\u535a'],
  [/instagram\.com$/i, 'Instagram'],
  [/x\.com$|twitter\.com$/i, 'X'],
  [/t\.me$|telegram\.me$/i, 'Telegram'],
  [/okjike\.com$/i, '\u5373\u523b'],
];

export function recognizedSourceLabel(value) {
  const match=String(value||'').match(/https?:\/\/[^\s]+/i);
  if(!match) return '';
  try {
    const hostname=new URL(match[0]).hostname.toLowerCase().replace(/^www\./,'');
    return PLATFORM_RULES.find(([pattern])=>pattern.test(hostname))?.[1] || '\u516c\u5f00\u94fe\u63a5';
  } catch { return ''; }
}

export function sourceInputHint(value) {
  const label=recognizedSourceLabel(value);
  return label ? '\u5df2\u8bc6\u522b ' + label + ' \u00b7 Ctrl/\u2318 + Enter \u751f\u6210' : '\u652f\u6301\u7c98\u8d34\u516c\u5f00\u94fe\u63a5\u6216\u6574\u6bb5\u5206\u4eab\u53e3\u4ee4';
}

export function isGenerateShortcut(event) {
  return event?.key === 'Enter' && Boolean(event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
}
