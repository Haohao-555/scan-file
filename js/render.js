function storageRender(data) {
    let dom = document.querySelector(".option .position");
    let str = "";
    data.forEach(item => {
        str += `  <div class="storage" onclick="storage('${item.mounted}')">
                     <div class="icon"></div>
                     <div class="info">
                        <div class="local">本地磁盘(${item.mounted})</div>
                        <div class="con">
                          <div class="take" style="width: ${stroageWidth(item.blocks, item.used)}"></div>
                        </div>
                        <div class="detail">${formatStroage(item.available)} 可用，共${formatStroage(item.blocks)}</div>
                    </div>
                </div>
              `
    })
    dom.innerHTML = str;
}
/**
* 地址栏渲染
* @param {String} path 地址 
*/
function pathRender(path) {
    pathAddr = path.split("\\");
    let str = "";
    pathAddr.forEach((item, i) => {
        str += `<span onclick=tobypath(${i})>${item}</span> \\`
    });
    document.getElementsByClassName("crumbs")[0].innerHTML = str;
}

/**
* 初始化表格头部标题（名称）样式
*/
function resetName() {
    let sel = `.content table thead tr .name .icon`;
    let dom = document.querySelector(sel);
    dom.dataset.flag = 0;
    dom.classList.add("ascend");
}

/**
* 重置表格头部样式
* @param {Array} data 数据 
*/
function restStyle(data) {
    data.forEach(item => {
        if (item == "type") {
            document.querySelector(`.content table thead tr .${item}`).dataset.flag = 0;
        } else {
            let sel = `.content table thead tr .${item} .icon`;
            let dom = document.querySelector(sel);
            dom.classList.remove("ascend");
            dom.classList.remove("descend");
            dom.dataset.flag = 1;
        }
    })
}

/**
* 
* @param {Array} folderList 文件夹数组
* @param {Array} fileList   文件数据
* @param {Array} noPermise 不可访问数据
* @param {Number} flag      排序： 1 升序（默认） 0 降序
* @returns 
*/
function dirRender(folderList, fileList, noPermise, el, flag = 1) {
    // 样式重置
    restStyle(["name", "time", "size", "type"]);
    let data = [];
    if (el == "name") {
        if (flag == 1) {
            data = folderList.concat(fileList).concat(noPermise);
        } else {
            data = noPermise.concat(fileList).concat(folderList);
        }
    } else {
        if (flag == 1) {
            data = folderList.concat(fileList).concat(noPermise)
        } else {
            data = fileList.concat(folderList).concat(noPermise)
        }
    }

    let str = "";
    for (let i = 0; i < data.length; i++) {
        let icon = "";
        // 可访问
        if (data[i].isAccess) {
            if (data[i].flag) {
                icon = `<div class="icon-folder"></div>`
                str += `<tr class=folder onclick=folderEvent(${i})>`
            } else {
                icon = `<div class="icon-file"></div>`
                str += `<tr class=file onclick=fileEvent(${i})>`
            }
            str += `<td class=name>${icon}<div class=td-name-container>${data[i].name}</div></td>
                      <td><div class=td-container>${formatDate(data[i].time)}</div></td>
                      <td><div class=td-container>${data[i].type}</div></td>
                      <td><div class=td-container>${formatSize(data[i].size)}</div></td>
                      <td><div class=td-container></div></td>
                   </tr>`
        } else {
            // 不可访问
            str += `
          <tr>
              <td class=name><div class="icon-permission"></div><div class=td-name-container>${data[i].name}</div></td>
              <td><div class=td-container></div></td>
              <td><div class=td-container>${data[i].type}</div></td>
              <td><div class=td-container></div></td>
              <td><div class=td-container>无法读取目录信息</div></td>
          </tr>
          `
        }

    }
    document.querySelector("tbody").innerHTML = str;
    // 将数据返回出去，保存
    return data;
}
