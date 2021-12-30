/**
 * 当前元素上移
 * @param  {array} array
 * @param  {number} index 当前元素索引
 */
export function itemUp(array, index) {
  itemSwap(array, index - 1, index);
}

/**
 * 当前元素下移
 * @param  {array} array
 * @param  {number} index 当前元素索引
 */
export function itemDown(array, index) {
  itemSwap(array, index, index + 1);
}

/**
 * 元素下移
 * @param  {array} array
 * @param  {number} index1 元素1索引
 *  @param  {number} index2 元素2索引
 */
export function itemSwap(array, index1, index2) {
  array[index1] = array.splice(index2, 1, array[index1])[0];
  return array;
}

export function createTreeByArray(
  array,
  { idKey = "id", pidKey = "parentId", childrenKey = "children" } = {}
) {
  if (!Array.isArray(array) || !array.length) return;
  let map = {};
  array.forEach(item => (map[item[idKey]] = item));

  let roots = [];
  array.forEach(item => {
    const parent = map[item[pidKey]];
    if (parent) {
      (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
    } else {
      roots.push(item);
    }
  });
  return roots;
}
