/**
 * 时间格式化
 * @param {Number} time 时间
 * @returns 格式化后的时间
 */
 function formatDate(time) {
  let date = new Date(time);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let min = date.getMinutes();
  min = min >= 10 ? min : "0" + min;
  m = m >= 10 ? m : "0" + m;
  d = d >= 10 ? d : "0" + d;
  h = h >= 10 ? h : "0" + h;
  return y + "/" + m + "/" + d + " " + h + ":" + min;
}


/**
* 文件大小格式化
* @param {Number} data 
* @returns 格式化后的文件大小
*/
function formatSize(size) {
  if (("" + size).trim().length != 0) {
      let valArray = ("" + Math.ceil(size / 1024)).split("").reverse();
      let formatArray = [];
      for (let i = 0; i < valArray.length; i++) {
          formatArray.push(valArray[i]);
          if ((i + 1) % 3 == 0) {
              formatArray.push(",");
          }
      }
      if (formatArray[formatArray.length - 1] == ",") {
          formatArray = formatArray.splice(0, formatArray.length - 1);
      }
      return formatArray.reverse().join("") + " " + "KB";
  }
  return "";
}

/**
* 
* @param {Number} size 磁盘大小可视化 
*/
function formatStroage(size) {
  return Math.floor(size / 1024 / 1024 / 1024) + " " + "GB";
}

/**
* 目录处理 (true: 为升序，false：为降序)
* @param {Array} data      排序数据
* @param {String} el       排序字段
* @param {Number} flag     排序： 1 升序（默认） 0 降序
* 
*/
function formatData(data, el, flag = 1) {
  if (el == "name") {
      let chinese = [];
      // 过滤掉中文开头名称
      data = data.filter(item => {
          if (/^[\u4e00-\u9fa5]+/.test(item.name)) {
              chinese.push(item)
              return false
          }
          return true
      })
      if (flag == 1) {
          chinese.sort(commonCompare)
          data.sort(SortLikeWin);
          data = data.concat(chinese);
      } else {
          chinese.sort(commonCompare).reverse();
          data.sort(SortLikeWin).reverse();
          data = chinese.concat(data);
      }
  } else {
      if (flag == 1) {
          data.sort((a, b) => {
              // 升序 1 2 3
              return a[el] - b[el];
          })
      } else {
          data.sort((a, b) => {
              // 降序
              return b[el] - a[el];
          })
      }
  }
  return data;
}

/**
* 
* @param {Number} blocks 大小 
* @param {Number} used 被使用
*/
function stroageWidth(blocks, used) {
  let w = 220;
  return w * used / blocks + "px";
}

/**
* 除中文开头和纯中文的排序
* @param {Number} v1 字符
* @param {Number} v2 字符
* @returns 
*/
function SortLikeWin(v1, v2) {
  let a = v1.name.split(".")[0];
  let b = v2.name.split(".")[0];
  let reg1 = /[0-9]+/g;
  let lista = a.match(reg1);
  let listb = b.match(reg1);
  if (!lista || !listb) {
      return a.localeCompare(b);
  }
  for (let i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
      //数字所在位置序号
      let indexa = a.indexOf(lista[i]);
      let indexb = b.indexOf(listb[i]);
      //数字前面的前缀
      let prefixa = a.substring(0, indexa);
      let prefixb = b.substring(0, indexb);
      //数字的string
      let stra = lista[i];
      let strb = listb[i];
      //数字的值
      let numa = parseInt(stra);
      let numb = parseInt(strb);
      //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
      if (indexa != indexb || prefixa != prefixb) {
          return a.localeCompare(b);
      } else {
          //数字的string全等
          if (stra === strb) {
              //如果是最后一个数字，比较数字的后缀
              if (i == minLen - 1) {
                  return a.substring(indexa).localeCompare(b.substring(indexb));
              }
              //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
              else {
                  a = a.substring(indexa + stra.length);
                  b = b.substring(indexa + stra.length);
              }
          }
          //如果数字的string不全等，但值相等
          else if (numa == numb) {
              //直接比较数字前缀0的个数，多的更小
              return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
          } else {
              //如果数字不等，直接比较数字大小
              return numa - numb;
          }
      }
  }
}

/**
* 中文开头和纯中文排序
* @param {Number} v1 
* @param {Number} v2 
* @returns 
*/
function commonCompare(v1, v2) {

  return v1.name.split(".")[0].localeCompare(v2.name);
}
