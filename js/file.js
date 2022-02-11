const { getDrives } = require('diskinfo');
const fs = require("fs");
const path = require("path");
// 地址栏
let pathAddr = [];
// 当前地址下标
let currPathIndex = -1;
// 目录信息（文件 文件夹）
let directory = [];
// 文件夹信息
let folderList = [];
// 文件信息
let fileList = [];
// 没有权限访问的文件
let noPermise = [];
//  地址数组（全部）
let pathList = [];

// 读取电脑系统盘数
window.onload = function() {
    console.time();
    getDrives(function(err, aDrives) {
        // 磁盘渲染
        storageRender(aDrives);
        // 地址栏渲染
        pathRender(aDrives[0].mounted);
        // 初始化环境
        init(aDrives[0].mounted);
        console.timeEnd();
    })
}

// 初始化
function init(path) {
    // 查找 C盘目录
    selectDir(path);
}

// 磁盘事件
function storage(path) {
    selectDir(path);
}
// 查询列表
function selectDir(pathName, flag = true) {
    // 读取目录
    let dir = fs.readdirSync(pathName + "\\");
    // 清空
    fileList = [];
    folderList = [];
    noPermise = [];
    // 目录信息读取
    for (let i = 0; i < dir.length; i++) {
        try {
            // 判断目录是否存在（不存在走 catch 逻辑）
            fs.accessSync(pathName + "\\" + dir[i], fs.constants.R_OK | fs.constants.W_OK);
            // 读取目录信息
            let stat = fs.statSync(pathName + "\\" + dir[i]);
            if (stat.isDirectory()) {
                folderList.push({
                    name: dir[i],
                    time: stat.mtimeMs,
                    type: "文件夹",
                    size: "",
                    flag: stat.isDirectory(),
                    isAccess: true,
                })
            } else {
                fileList.push({
                    name: dir[i],
                    time: stat.mtimeMs,
                    type: "文件",
                    size: stat.size,
                    flag: stat.isDirectory(),
                    isAccess: true,
                })
            }
        } catch (error) {
            // 该目录没有权限访问
            noPermise.push({
                name: dir[i],
                time: 0,
                type: "",
                size: 0,
                flag: false,
                isAccess: false
            })
        }

    }
    // 目录处理（排序）
    folderList = formatData(folderList, "name");
    fileList = formatData(fileList, "name");
    noPermise = formatData(noPermise, "name");
    // dir 渲染
    directory = dirRender(folderList, fileList, noPermise, "name");
    // path 渲染
    pathRender(pathName);
    // 初始化标题（name）
    resetName();
    if (flag) {
        // 将路径存到数组中
        pathList.push(pathName);
        // 保存当前地址下标
        currPathIndex = pathList.length - 1;
    }
    // 增加前进或后退事件
    addEvent();
}

// 文件夹事件
function folderEvent(i) {
    let curr = directory[i].name;
    let prev = pathList[currPathIndex];
    if (currPathIndex < pathList.length - 1) {
        pathList.splice(currPathIndex + 1);
    }
    // 判断该目录是否存在
    try {
        fs.readdirSync(prev + "\\" + curr);
        selectDir(prev + "\\" + curr);
    } catch {
        alert("在目录 " + prev + "\\" + curr + " 中用户没有访问权限");
    }

}

// 文件事件
function fileEvent(i) {
    console.log(directory[i])
}

// 地址栏事件
function tobypath(i) {
    let path = pathAddr.slice(0, i + 1).join("\\");
    selectDir(path);
}

// 标题事件
function titleSort(el) {
    if (el == 'type') {
        let dom = document.querySelector(`.content table thead tr .${el}`);
        let flag = dom.dataset.flag
        directory = dirRender(folderList, fileList, noPermise, el, flag);
        dom.dataset.flag = flag == 1 ? 0 : 1;
    } else {
        let sel = `.content table thead tr .${el} .icon`;
        let dom = document.querySelector(sel);
        let flag = dom.dataset.flag;
        // 数据处理
        folderList = formatData(folderList, el, flag);
        fileList = formatData(fileList, el, flag);
        noPermise = formatData(noPermise, el, flag);
        // 渲染
        directory = dirRender(folderList, fileList, noPermise, el, flag);
        // 样式修改
        if (flag == 1) {
            // 升序
            dom.classList.remove("descend")
            dom.classList.add("ascend")
            dom.dataset.flag = 0;
        } else {
            // 降序
            dom.classList.add("descend")
            dom.classList.remove("ascend")
            dom.dataset.flag = 1
        }
    }

}

// 后退
function backEvent() {
    let prev = pathList[currPathIndex - 1];
    currPathIndex -= 1;
    selectDir(prev, false);
}

// 前进
function forwardEvent() {
    let next = pathList[currPathIndex + 1];
    currPathIndex += 1;
    selectDir(next, false);

}

// 增加前进或后退事件
function addEvent() {
    let back = document.querySelector(".path .choose .box:first-child");
    let forward = document.querySelector(".path .choose .box:nth-child(2)");
    // 前进事件
    if (currPathIndex != pathList.length - 1) {
        forward.onclick = forwardEvent;
        forward.classList.remove("forward");
        forward.classList.add("forward-active");
    } else {
        forward.onclick = null;
        forward.classList.remove("forward-active");
        forward.classList.add("forward");
    }
    // 后退事件
    if (currPathIndex != 0) {
        back.onclick = backEvent;
        back.classList.remove("back");
        back.classList.add("back-active");
    } else {
        back.onclick = null;
        back.classList.remove("back-active");
        back.classList.add("back");
    }
}
