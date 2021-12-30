/**
 * 根据矩形的第一、二、三个点，返回矩形四个点
 * 先根据第一、二点计算两边的方向
 * 再第一、三点计算第二、四点
 * @param  {[x,y]} onePoint
 * @param  {[x,y]} twoPoint
 * @param  {[x,y]} threePoint
 * @returns null | [[x,y],[x,y],[x,y],[x,y]]
 */
export function calculateRectPoints(onePoint, twoPoint, threePoint) {
  if (!onePoint || !twoPoint || !threePoint) {
    return;
  }

  let Bx = 0,
    By = 0,
    Dx = 0,
    Dy = 0;

  if (twoPoint[0] === onePoint[0]) {
    //  第一、二点垂直
    Bx = onePoint[0];
    By = threePoint[1];
    Dx = threePoint[0];
    Dy = onePoint[1];
  } else if (twoPoint[1] === onePoint[1]) {
    //  第一、二点水平
    Bx = threePoint[0];
    By = onePoint[1];
    Dx = onePoint[0];
    Dy = threePoint[1];
  } else {
    // 根据第一、二点计算直线y = kx + b
    // 相互垂直的两条直线斜率相乘等于-1
    let k_AB = (twoPoint[1] - onePoint[1]) / (twoPoint[0] - onePoint[0]);
    let b_AB = onePoint[1] - k_AB * onePoint[0];

    let k_CD = k_AB;
    let b_CD = threePoint[1] - k_CD * threePoint[0];

    let k_BC = -1 / k_AB;
    let b_BC = threePoint[1] - k_BC * threePoint[0];

    let k_AD = k_BC;
    let b_AD = onePoint[1] - k_AD * onePoint[0];

    // 两条线的交点
    Bx = (b_AB - b_BC) / (k_BC - k_AB);
    By = k_AB * Bx + b_AB;
    Dx = (b_AD - b_CD) / (k_CD - k_AD);
    Dy = k_AD * Dx + b_AD;
  }

  return [onePoint, [Bx, By], threePoint, [Dx, Dy]];
}

export function updateRectPoints(points, index, coordinate) {
  if (!Array.isArray(points) || points.length < 3) {
    return;
  }

  let A = points[0],
    B = points[1],
    C = points[2],
    D = null;

  let isHorizontal = false,
    isVertical = false;
  let k_AB, k_AD, k_BC, k_CD;
  let b_AB, b_AD, b_BC, b_CD;
  let x1, y1, x2, y2;

  if (A[0] === B[0]) {
    isVertical = true;
  } else if (A[1] === B[1]) {
    isHorizontal = true;
  } else {
    k_AB = (A[1] - B[1]) / (A[0] - B[0]);
    k_AD = -1 / k_AB;
    k_BC = k_AD;
    k_CD = k_AB;

    b_AB = A[1] - k_AB * A[0];
    b_AD = A[1] - k_AD * A[0];
    b_BC = C[1] - k_BC * C[0];
    b_CD = C[1] - k_CD * C[0];
  }

  if (index === 0) {
    A = coordinate;
    if (isVertical) {
      B = [A[0], C[1]];
      D = [C[0], A[1]];
    } else if (isHorizontal) {
      B = [C[0], A[1]];
      D = [A[0], C[1]];
    } else {
      b_AB = A[1] - k_AB * A[0];
      b_AD = A[1] - k_AD * A[0];

      x1 = (b_AB - b_BC) / (k_BC - k_AB);
      y1 = k_AB * x1 + b_AB;
      x2 = (b_AD - b_CD) / (k_CD - k_AD);
      y2 = k_AD * x2 + b_AD;

      B = [x1, y1];
      D = [x2, y2];
    }
  } else if (index === 1) {
    let old = calculateRectPoints(A, B, C);
    B = coordinate;
    if (isVertical) {
      A = [B[0], A[1]];
      C = [C[1], B[1]];
      D = [C[0], A[1]];
    } else if (isHorizontal) {
      A = [A[0], B[1]];
      C = [B[0], C[1]];
      D = [A[0], C[1]];
    } else {
      D = old[3];

      b_AD = D[1] - k_AD * D[0];
      b_CD = D[1] - k_CD * D[0];
      b_AB = B[1] - k_AB * B[0];
      b_BC = B[1] - k_BC * B[0];

      x1 = (b_AB - b_AD) / (k_AD - k_AB);
      y1 = k_AB * x1 + b_AB;
      x2 = (b_BC - b_CD) / (k_CD - k_BC);
      y2 = k_BC * x2 + b_BC;

      A = [x1, y1];
      C = [x2, y2];
    }
  } else if (index === 2) {
    C = coordinate;
    if (isVertical) {
      B = [A[0], C[1]];
      D = [C[0], A[1]];
    } else if (isHorizontal) {
      B = [C[0], A[1]];
      D = [A[0], C[1]];
    } else {
      b_BC = C[1] - k_BC * C[0];
      b_CD = C[1] - k_CD * C[0];

      x1 = (b_AB - b_BC) / (k_BC - k_AB);
      C;
      y1 = k_AB * x1 + b_AB;
      x2 = (b_AD - b_CD) / (k_CD - k_AD);
      y2 = k_AD * x2 + b_AD;

      B = [x1, y1];
      D = [x2, y2];
    }
  }
  return [A, B, C, D, A];
}

/**
 * 根据中心点、长轴、短轴生成圆点集
 * @param  {[x,y]} center 中心点
 * @param  {[x,y]} longPoint 长轴点
 * @param  {number} longAxisRadius 长轴半径
 * @param  {number} shortAxisRadius 短轴半径
 * @param  {number} [num] = 72 生成点个数
 * @returns null | Array([x,y])
 */
export function calculateCirclePoints(
  center,
  longPoint,
  longAxisRadius,
  shortAxisRadius,
  num = 72
) {
  let points = [];
  let dx = center[0] - longPoint[0];
  let dy = center[1] - longPoint[1];
  let rotation = Math.atan2(dy, dx);
  for (let i = 0; i <= num; i++) {
    let angle = (Math.PI * 2 * i) / num;
    let x = center[0] + longAxisRadius * Math.cos(angle);
    let y = center[1] + shortAxisRadius * Math.sin(angle);
    let point = [x, y];

    // 椭圆时，需旋转
    if (longAxisRadius != shortAxisRadius) {
      point = rotate([x, y], center, rotation);
    }

    points.push(point);
  }
  return points;
}

/**
 * @param  {[x,y]} point 待旋转的点
 * @param  {[x,y]} center 旋转中心点
 * @param  {number} angle 弧度
 * @returns [x,y] 旋转后的点
 */
function rotate(point, center, angle) {
  const deltaX = point[0] - center[0];
  const deltaY = point[1] - center[1];
  let x = center[0] + deltaX * Math.cos(angle) - deltaY * Math.sin(angle);
  let y = center[1] + deltaX * Math.sin(angle) + deltaY * Math.cos(angle);
  return [x, y];
}
