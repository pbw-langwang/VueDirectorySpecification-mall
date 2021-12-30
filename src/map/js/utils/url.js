export function getParamByUrl(url) {
  if (!url) {
    return;
  }
  let index = url.indexOf("?");
  if (index == -1) {
    return;
  }
  let paramString = url.substr(index + 1);
  var vars = paramString.split("&");
  let result = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    result[pair[0]] = pair[1];
  }
  return result;
}
