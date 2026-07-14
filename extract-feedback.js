export const EXTRACT_FEEDBACK_STATES = Object.freeze(['loading', 'success', 'limited', 'error']);

export function loadingExtractFeedback() {
  return { state: 'loading', title: '正在读取', summary: '连接公开页面', message: '', actions: [] };
}

export function feedbackForMetadata(metadata = {}, imageCount = 0) {
  const status = String(metadata?.status || 'ok');
  const platform = String(metadata?.platformLabel || '该平台').trim() || '该平台';
  if (status === 'ok') {
    return {
      state: 'success',
      title: '已提取',
      summary: `${Math.max(0, Number(imageCount) || 0)} 张图片 · 可继续编辑`,
      message: '',
      actions: [],
    };
  }
  if (status === 'login_required') {
    return {
      state: 'limited',
      title: '访问受限',
      summary: platform,
      message: '平台限制匿名读取，可手动补充正文，或添加图片继续排版。',
      actions: ['manual', 'upload'],
    };
  }
  if (status === 'unavailable') {
    return {
      state: 'limited',
      title: '内容不可用',
      summary: '可继续手动排版',
      message: '内容可能已下架、审核中或仅自己可见，可补充正文和图片继续创作。',
      actions: ['manual', 'upload'],
    };
  }
  return {
    state: 'limited',
    title: '需要补充',
    summary: '仅提取到公开摘要',
    message: '已保留可读取的公开信息，可继续补充正文和图片。',
    actions: ['manual', 'upload'],
  };
}

export function feedbackForFailure(error) {
  const detail = String(error?.message || error || '').trim();
  let message = '暂时无法读取这个链接，原有内容没有被覆盖。';
  if (/匿名|登录|限制|拒绝|forbidden|unauthorized/i.test(detail)) {
    message = '平台限制匿名读取，原有内容没有被覆盖。';
  } else if (/超时|timeout|timed out/i.test(detail)) {
    message = '平台响应超时，原有内容没有被覆盖。';
  } else if (/无效|链接|url|invalid/i.test(detail)) {
    message = '没有识别到可读取的公开链接，原有内容没有被覆盖。';
  }
  return {
    state: 'error',
    title: '提取失败',
    summary: '原内容已保留',
    message,
    actions: ['retry', 'upload'],
  };
}
