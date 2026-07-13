function mediaSize(item) {
  const width = Number(item?.naturalWidth || item?.width || 0);
  const height = Number(item?.naturalHeight || item?.height || 0);
  return { width, height, ratio: width > 0 && height > 0 ? width / height : 1 };
}

export function chooseMediaLayout(items = []) {
  const count = items.length;
  const ratios = items.map(item => mediaSize(item).ratio);
  const portrait = ratios.filter(ratio => ratio < 0.82).length > count / 2;
  const widestRatio = Math.max(...ratios, 0);
  const widestIndex = ratios.indexOf(widestRatio);
  let type = 'single';
  let columns = 1;
  let heroIndex = -1;
  let wideIndices = [];

  if (count === 2) {
    type = 'pair';
    columns = 2;
  } else if (count === 3) {
    type = 'featured';
    columns = 2;
    heroIndex = widestIndex;
  } else if (count === 4 && widestRatio >= 1.35) {
    type = 'featured';
    columns = 3;
    heroIndex = widestIndex;
  } else if (count === 4) {
    type = 'grid-2';
    columns = 2;
  } else if (count === 5) {
    type = 'featured';
    columns = 2;
    heroIndex = widestIndex;
  } else if (count >= 7 && count % 3 === 1) {
    type = 'featured';
    columns = 3;
    heroIndex = widestIndex;
  } else if (count >= 8 && count % 3 === 2) {
    type = 'balanced';
    columns = 6;
    wideIndices = [count - 2, count - 1];
  } else if (count >= 6) {
    type = 'grid-3';
    columns = 3;
  }

  const orderedIndices = heroIndex >= 0
    ? items.map((_, index) => index).filter(index => index !== heroIndex).concat(heroIndex)
    : items.map((_, index) => index);

  return { type, columns, heroIndex, wideIndices, portrait, orderedIndices };
}

export function buildAutoMediaLayout(items = [], width, gap = 18) {
  const plan = chooseMediaLayout(items);
  if (!items.length || width <= 0) return { ...plan, cells: [], height: 0 };

  if (plan.type === 'single') {
    const ratio = mediaSize(items[0]).ratio || 1.6;
    const height = Math.min(640, Math.max(260, Math.round(width / ratio)));
    return { ...plan, cells: [{ index: 0, x: 0, y: 0, width, height, fit: 'contain' }], height };
  }

  const cells = [];
  if (plan.type === 'featured') {
    const thumbIndices = plan.orderedIndices.slice(0, -1);
    const cellWidth = (width - gap * (plan.columns - 1)) / plan.columns;
    const cellHeight = cellWidth;
    thumbIndices.forEach((index, position) => {
      const row = Math.floor(position / plan.columns);
      const column = position % plan.columns;
      cells.push({
        index,
        x: Math.round(column * (cellWidth + gap)),
        y: Math.round(row * (cellHeight + gap)),
        width: Math.round(cellWidth),
        height: Math.round(cellHeight),
        fit: 'cover',
      });
    });
    const thumbRows = Math.ceil(thumbIndices.length / plan.columns);
    const heroY = thumbRows * cellHeight + Math.max(0, thumbRows) * gap;
    const heroHeight = Math.round(width / 3);
    cells.push({
      index: plan.heroIndex,
      x: 0,
      y: Math.round(heroY),
      width,
      height: heroHeight,
      fit: 'cover',
    });
    return { ...plan, cells, height: Math.round(heroY + heroHeight) };
  }

  if (plan.type === 'balanced') {
    const standardCount = items.length - 2;
    const cellWidth = (width - gap * 2) / 3;
    for (let position = 0; position < standardCount; position += 1) {
      const row = Math.floor(position / 3);
      const column = position % 3;
      cells.push({
        index: position,
        x: Math.round(column * (cellWidth + gap)),
        y: Math.round(row * (cellWidth + gap)),
        width: Math.round(cellWidth),
        height: Math.round(cellWidth),
        fit: 'cover',
      });
    }
    const rows = Math.ceil(standardCount / 3);
    const lastY = rows * cellWidth + rows * gap;
    const wideWidth = (width - gap) / 2;
    plan.wideIndices.forEach((index, position) => {
      cells.push({
        index,
        x: Math.round(position * (wideWidth + gap)),
        y: Math.round(lastY),
        width: Math.round(wideWidth),
        height: Math.round(cellWidth),
        fit: 'cover',
      });
    });
    return { ...plan, cells, height: Math.round(lastY + cellWidth) };
  }

  const cellWidth = (width - gap * (plan.columns - 1)) / plan.columns;
  const cellHeight = plan.portrait ? cellWidth * 1.2 : cellWidth;
  plan.orderedIndices.forEach((index, position) => {
    const row = Math.floor(position / plan.columns);
    const column = position % plan.columns;
    cells.push({
      index,
      x: Math.round(column * (cellWidth + gap)),
      y: Math.round(row * (cellHeight + gap)),
      width: Math.round(cellWidth),
      height: Math.round(cellHeight),
      fit: 'cover',
    });
  });
  const rows = Math.ceil(items.length / plan.columns);
  return { ...plan, cells, height: Math.round(rows * cellHeight + Math.max(0, rows - 1) * gap) };
}
