/**
 * MIT License
 * 
 * Copyright (c) 2021 r3inbowari
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

/**
 * Refine Project
 * @author r3inbowari
 * @create 2021/01/19
 * @update 2021/01/22
 * @version 1.1.4
 */

/**
 * NOTE:
 * 1. 关闭省电模式
 * 2. 开启视角锁定模式
 * 
 */

/**
 * read-only values, please don't change it!
 */
const NPC = 0;
const SKILL = 1;

const FIRST_PACK = 0;
const SECOND_PACK = 1;
const THIRD_PACK = 2;
const FOURTH_PACK = 3;
const FIFTH_PACK = 4;

const FIRST_SKILL = 5;
const SECOND_SKILL = 6;
const THIRD_SKILL = 7;
const FOURTH_SKILL = 8;
const FIFTH_SKILL = 9;
const SIXTH_SKILL = 10;

const UNDEFINE_INDEX = 200;

const FIRST_ROLE = 0;
const SECOND_ROLE = 1;
const THIRD_ROLE = 2;

const SECOND = 1000;

const MODE_BUY_REFINE = 0;
const MODE_BUY_PRISE = 1;
const MODE_BUY_HYBIRD = 2;

/**
 * customizable configuration values.
 */
// 文件系统目录
var CONFIG_PUBLIC_PATH = '/sdcard/Pictures/';
// 打开商店的方式
var CONFIG_OPEN_STORE_WAY = NPC;
// 商店技能索引
var CONFIG_INDEX_STORESKILL = FIRST_SKILL;
// 蝴蝶翅膀技能索引
var CONFIG_INDEX_BUTTERFLY = SECOND_PACK;
// 点击最大误差
var CONFIG_TAP_RAND = 10;
// 是否开启控制台
var CONFIG_SHOW_CONSOLE = 0;
// 交易所NPC位置
var CONFIG_COORD_STORE_NPC = { X: 1048, Y: 363 };
// 精炼NCP位置
var CONFIG_COORD_REFINE_NPC = { X: 0, Y: 0 };
// 搜索物品对象
var CONFIG_SEARCH_ITEMS = [
	{ Name: '神圣复仇者', X: 1000, Y: 330, Time: 30, SleepFreq: 2000 }
]
// 交易密码
var CONFIG_PASSWORD = 'Qq159463';
// 首个加载角色索引
var CONFIG_ROLE_INDEX = THIRD_ROLE;
// 角色数据加载, 请按顺序填入三个角色的对应参数
var CONFIG_ROLES = [
	{ INDEX_STORESKILL: FIFTH_SKILL, INDEX_BUTTERFLY: SECOND_PACK },
	{ INDEX_STORESKILL: FIFTH_SKILL, INDEX_BUTTERFLY: SECOND_PACK },
	{ INDEX_STORESKILL: FIFTH_SKILL, INDEX_BUTTERFLY: SECOND_PACK }
]

// 每购买8次进行一次zeny回收
var CONFIG_REFRESH_TABLE_FREQ = 8;
// 购买模式 选择不同的模式用以应对工作室的打赏压栈行为, 可选模式(默认是价格升序模式):
// MODE_BUY_PRISE 价格升序模式 缺点: 无法应对低价打赏行为 优点: 切换周期快
// MODE_BUY_REFINE 精炼升序模式 缺点: 无法应对高价打赏行为 优点: 切换周期快
// MODE_BUY_HYBIRD 混合模式(价格升序模式 + 精炼升序模式) 缺点: 切换周期变长 优点: 但是应对工作室最有效
var CONFIG_BUY_MODE = MODE_BUY_PRISE;

// 启动游戏等待时间
var CONFIG_WAIT_TIME_RUNRO = 60;
// 选角色等待时间
var CONFIG_WAIT_TIME_GAMESTART = 20;
// 正式开始游戏等待时间
var CONFIG_WAIT_TIME_ROLESTART = 50;

/**
 * 接口对象
 */
var Interface = {
	/**
	 * 随机误差点击坐标
	 * @param {int} x 横坐标
	 * @param {int} y 纵坐标
	 */
	tap(x, y) {
		// 随机数生成
		var r0 = 0;
		var r1 = 0;
		if (CONFIG_TAP_RAND > 0) {
			r0 = rand(1, CONFIG_TAP_RAND);
			r1 = rand(1, CONFIG_TAP_RAND);
		}
		Tap(x + r0, y + r1);
		cmd.info('tap ' + Number(x + r0) + ', ' + Number(y + r1));
		sleep(100);
	},

	/**
	 * 精准点击坐标
	 * @param {int} x 横坐标
	 * @param {int} y 纵坐标
	 */
	goto(x, y) {
		Tap(x, y);
		cmd.info('goto ' + x + ', ' + y);
		sleep(100);
	},

	/**
	 * 默认滑动
	 * @param {int} x1 横坐标
	 * @param {int} y1 纵坐标
	 * @param {int} x2 横坐标
	 * @param {int} y2 纵坐标
	 */
	swipe(x1, y1, x2, y2) {
		Swipe(x1, y1, x2, y2)
		cmd.info('swipe ' + x1 + ', ' + y1 + ' to ' + x2 + ', ' + y2);
		sleep(100);
	},

	/**
	 * 长按1500ms
	 * @param {int} x 横坐标
	 * @param {int} y 纵坐标
	 */
	longClick(x, y) {
		Swipe(x, y, x, y, 1500);
		sleep(100);
	}
}

/**
 * 日志控制台
 */
var cmd = {
	show() {
		console.show();
		cmd.info('show console window');
	},

	hide() {
		console.hide();
		cmd.info('hide console window');
	},

	clear() {
		console.clear();
		cmd.info('clear console information ok');
	},

	warn(msg) {
		var fmt = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.warn(' [' + fmt + '] [WARN] ' + msg)
	},

	info(msg) {
		var fmt = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.info(' [' + fmt + '] [INFO] ' + msg)
	},

	fail(msg) {
		var fmt = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.error(' [' + fmt + '] [FAIL] ' + msg)
	},
}

/**
 * format原型插入
 * @param {{string}} fmt format格式
 */
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

// 全局系统调用控制台
var sh = new Shell(true);

// 看门狗
var isDead = false;

// 交易密码是否已经写入
var isVerify = false;

// 是否需要使用回城翅膀, 理论上在脚本走完第一轮后不再需要执行回城操作
// 为三个角色添加flag参数
var needBackHome = [0, 0, 0];

// 商店购买计数器, 用于计算是否应该回收zeny
var cntRefreshTable = 0;

// 下一个打开的角色
var nextRole = CONFIG_ROLE_INDEX;

// 当前角色
var currentRole = CONFIG_ROLE_INDEX;

// 下一次购买模式
var nextBuyMode = 0;

// 用户注册相关变量
var bak = 1 << 5;
var cpp = 1 << 1;
var const1 = "脚本已注册，服务器验证通过";
var const2 = "脚本未注册，请联系作者购买授权(r3inbowari@gmail.com)";

/**
 * 范围随机数生成函数
 * @param {int} min 最小值
 * @param {int} max 最大值
 */
function rand(min, max) {
	return parseInt(Math.random() * (max - min + 1) + min, 10);
}

/**
 * 系统调用
 * @param {string} common 调用命令
 */
function systemCall(common) {
	// var sh = new Shell(true);
	sh.exec(common);
	// 发送 kill waiting 信号量
	// sh.exitAndWaitFor();
	sleep(2000);
	// sh.exit();
}

/**
 * 全屏截图
 * @param {string} name 截图临时保存名称
 */
function systemCallRootGetScreen(name) {
	var src = CONFIG_PUBLIC_PATH + name + '.png';
	systemCall('screencap -p ' + src);
	return images.read(src);
}

/**
 * 文件系统图片获取
 * @param {string} name 
 */
function getPicture(name) {
	var src = CONFIG_PUBLIC_PATH + name + '.png';
	return images.read(src);
}

/**
 * 截取区域快照并保存文件到文件系统
 * @param {string} name 保存到文件系统的名称
 * @param {int} x 横坐标
 * @param {int} y 纵坐标
 * @param {int} w 宽度
 * @param {int} h 高度
 */
function setPicture(name, x, y, w, h) {
	var src = CONFIG_PUBLIC_PATH + name + '.png';
	console.log(src);
	systemCall('screencap -p ' + src);
	var img = images.read(src);
	console.log(img);
	var clip = images.clip(img, x, y, w, h);
	images.save(clip, CONFIG_PUBLIC_PATH + name + ".png");
}

/**
 * 系统初始化
 */
function initSystem() {
	cmd.info('refine project v1.0.0 593cde1...8a81ed1 build at 2021/01/18');
	sleep(100);
	cmd.info('author@r3inbowari .-. --- .-. . ..-. .. -. .');
	sleep(100);

	// 基础分辨率设置
	setScreenMetrics(1600, 900);
	cmd.info('setting screen metrics to 900, 1600');

	// 请求系统屏幕截图权限
	if (!requestScreenCapture()) {
		cmd.fail("权限获取失败");
		exit();
	}

	// 开启控制台
	if (CONFIG_SHOW_CONSOLE === 1)
		cmd.show();
}

/**
 * 使用地图前往某个给定坐标(x, y), 并且等待n毫秒
 * @param {int} x 横坐标
 * @param {int} y 纵坐标
 * @param {int} n 毫秒
 */
function aimMap(x, y, n) {
	Interface.tap(1500, 120);
	Interface.goto(x, y);
	Interface.tap(1500, 120);
	sleep(n);
}

/**
 * 使用技能或寻路开启商店逻辑
 */
function openStore() {
	console.log('open store');
	if (CONFIG_OPEN_STORE_WAY === SKILL) {
		// 通过技能的方式打开交易所
		useObject(CONFIG_INDEX_STORESKILL, SECOND * 2000);
	} else {
		// 通过步行的方式打开交易所
		// 前往BigCat交易所NPC地点, 并且等待25秒(普隆德拉最高跑步耗时)
		aimMap(CONFIG_COORD_STORE_NPC.X, CONFIG_COORD_STORE_NPC.Y, SECOND * 25);
		// 点击NPC
		Interface.tap(700, 390);
		sleep(1000);
		// NPC对话打开
		Interface.tap(1400, 600);
	}
	sleep(3000);
}

/**
 * 角色切换逻辑
 * @param {int} index 角色索引
 */
function switchRole(index) {
	Interface.tap(1340, 72);
}

function test_switchRole() {
	cmd.hide();
	//setPicture('fuchouzhe', 555, 360, 65, 30);
	var res = findImageBySnapshot('fuchouzhe');
	if (res) {
		toast("找到啦:" + res.x);
		Interface.tap(res.x + 300, res.y);

		// var mainImg = getPicture('snapshot');
		// if (images.detectsColor(mainImg, "#FEF6D8", res.x + 300, res.y)) {
		// 	toast("yellow");
		// }

	} else {
		toast("没找到");
	}
}

/**
 * 使用两个图片文件进行完全图片比对搜索
 * @param {string} 模式图片地址
 * @param {string} 主图片地址
 * @return {Point} 坐标对象结构
 */
function findImageByFiles(tempImgName, mainImgName) {
	var templateImg = getPicture(tempImgName);
	var mainImg = getPicture(mainImgName);
	var res = images.findImage(mainImg, templateImg, {
		threshold: 0.98
	})
	return res
}

/**
 * 使用快照进行完全图片比对搜索
 * @param {string} 模式图片地址
 * @return {Point} 坐标对象结构
 */
function findImageBySnapshot(tempImgName) {
	var mainImg = systemCallRootGetScreen('snapshot');
	var templateImg = getPicture(tempImgName);
	var res = images.findImage(mainImg, templateImg, {
		threshold: 0.98
	})
	return res
}

/**
 * 道具栏与技能栏对象映射函数
 * @param {int} index 道具栏索引 0-4
 * @param {int} sleepTime 休眠时间(ms)
 */
function useObject(index, sleepTime) {
	switch (index) {
		// 道具栏映射
		case FIRST_PACK:
			Interface.tap(1000, 720);
			break;
		case SECOND_PACK:
			Interface.tap(1100, 720);
			break;
		case THIRD_PACK:
			Interface.tap(1200, 720);
			break;
		case FOURTH_PACK:
			Interface.tap(1300, 720);
			break;
		case FIFTH_PACK:
			Interface.tap(1400, 720);
			break;
		// 技能栏映射
		case FIRST_SKILL:
			Interface.tap(900, 830);
			break;
		case SECOND_SKILL:
			Interface.tap(1000, 830);
			break;
		case THIRD_SKILL:
			Interface.tap(1100, 830);
			break;
		case FOURTH_SKILL:
			Interface.tap(1200, 830);
			break;
		case FIFTH_SKILL:
			Interface.tap(1300, 830);
			break;
		case SIXTH_SKILL:
			Interface.tap(1400, 830);
			break;
		// 映射失败
		default:
			cmd.warn('use a error index, please check your code.');
	}
	// 休眠时间
	sleep(sleepTime);
}

function test_useObject() {
	useObject(FIRST_PACK, 2000);
	useObject(SECOND_PACK, 2000);
	useObject(THIRD_PACK, 2000);
	useObject(FOURTH_PACK, 2000);
	useObject(FIFTH_PACK, 2000);
	useObject(FIRST_SKILL, 2000);
	useObject(SECOND_SKILL, 2000);
	useObject(THIRD_SKILL, 2000);
	useObject(FOURTH_SKILL, 2000);
	useObject(FIFTH_SKILL, 2000);
	useObject(SIXTH_SKILL, 2000);
	useObject(UNDEFINE_INDEX, 2000);
}

/**
 * 物体识别与购买
 * @param item 物品参数 
 * @return 是否还有钱
 */
function objectDetect(item) {
	// 点击交易记录
	Interface.tap(550, 105);
	sleep(2000);
	// 点击交易记录
	Interface.tap(1350, 835);
	sleep(1000);
	// 再次点击交易记录
	Interface.tap(1350, 835);
	sleep(1000);
	// 点击我要购买
	Interface.tap(220, 105);
	// item.Time次迭代
	for (let index = 0; index < item.Time; index++) {
		// setPicture('fuchouzhe', 555, 360, 65, 30);
		if (cntRefreshTable > CONFIG_REFRESH_TABLE_FREQ) {
			// 刷新时机满足
			// 点击交易记录
			Interface.tap(550, 105);
			sleep(1000);
			// 点击交易记录
			Interface.tap(1350, 835);
			sleep(1000);
			// 再次点击交易记录
			Interface.tap(1350, 835);
			sleep(1000);
			// 点击我要购买
			Interface.tap(220, 105);
			sleep(1000);

			if (CONFIG_BUY_MODE === MODE_BUY_REFINE) {
				// 使用精炼升序
				// 降序排列刷新
				Interface.tap(1050, 110)
				sleep(2000);
				// 升序排列刷新
				Interface.tap(1050, 110)
				sleep(2000);
			} else if (CONFIG_BUY_MODE === MODE_BUY_PRISE) {
				// 使用价格升序
				// 降序排列刷新
				Interface.tap(1260, 110);
				sleep(2000);
				// 升序排列刷新
				Interface.tap(1260, 110);
				sleep(2000);
			} else if (CONFIG_BUY_MODE === MODE_BUY_HYBIRD) {
				// 混合模式
				if (nextBuyMode === 0) {
					nextBuyMode = 1;
					// 使用精炼升序
					// 降序排列刷新
					Interface.tap(1050, 110)
					sleep(2000);
					// 升序排列刷新
					Interface.tap(1050, 110)
					sleep(2000);
				} else {
					nextBuyMode = 0;
					// 使用价格升序
					// 降序排列刷新
					Interface.tap(1260, 110);
					sleep(2000);
					// 升序排列刷新
					Interface.tap(1260, 110);
					sleep(2000);
				}
			}
			cntRefreshTable = 0;
		}
		cntRefreshTable++;

		var res = findImageBySnapshot('fuchouzhe');
		if (res) {
			toast("找到：" + res.x);
			// 点击找到的装备
			Interface.tap(res.x + 300, res.y);
			sleep(2000);
			// 点击预购买
			Interface.tap(1350, 820);
			sleep(2000);
			// 点击购买
			Interface.tap(650, 750);
			sleep(2000);

			// 检查是否需要验证
			if (CONFIG_PASSWORD != '') {
				passwordVerify();
			}

			// 检查是否还有zeny
			var zeny = findImageBySnapshot('goumai');
			if (zeny != null) {
				toast("没钱了, 等待退出");
				return false;
			}
			// 
			// var mainImg = getPicture('snapshot');
			// if (images.detectsColor(mainImg, "#FEF6D8", res.x + 300, res.y)) {
			// 	toast("yellow");
			// }

		} else {
			toast("没找到");
		}
		sleep(item.SleepFreq);
	}
	return true
}

/**
 * 用户逻辑测试
 */
function test_userLogic() {
	// 开启RO
	openRO();
	// 回城
	backHome();
	// 打开商店
	openStore();

	try {
		// 配置读取
		CONFIG_SEARCH_ITEMS.forEach(item => {
			// 通过搜索进入详细页
			searchItem(item);
			// 对象搜索与购买
			if (!objectDetect(item)) {
				// 没钱了彻底退出
				throw new Error("End");
			}
		});
	} catch (e) {
		cmd.warn(e.message);
	}

	// 停止运行
	killApp('com.xd.ro.roapk');
	toast("已退出RO, 10秒后重启");
	sleep(SECOND * 10);
}

/**
 * 交易所单个物品关键字搜索
 * @param {string} name 搜索关键字
 * @param {int} index 需要索引的位置
 */
function searchItem(item) {
	// 点击搜索按钮
	Interface.tap(300, 200)
	sleep(2000);
	// 点击进入搜索输入框
	Interface.tap(800, 220)
	sleep(2000);
	// 关键字加载
	setClip(item.Name);
	// 长按搜索输入框
	Interface.longClick(100, 835);
	sleep(2000);
	// 点击粘贴
	Interface.goto(100, 835);
	sleep(2000);
	// 退出搜索输入框
	Interface.goto(1500, 835);
	sleep(2000);
	// 点击搜索
	Interface.goto(1200, 220);
	sleep(2000);
	// 点击实际配置位置
	Interface.tap(item.X, item.Y)
	sleep(2000);
	// 初始化价格升序
	Interface.tap(1260, 110);
	sleep(2000);
	// 初始化精炼升序
	Interface.tap(1050, 110);
	sleep(2000);
}

/**
 * 使用蝴蝶翅膀
 */
function backHome() {
	// 判断是否需要使用回城技能
	if (needBackHome[currentRole] === 0) {
		useObject(CONFIG_INDEX_BUTTERFLY, SECOND * 8);
		needBackHome[currentRole] = 1;
	}
}

/**
 * 停止APP
 * @param {string} packageName 包名
 */
function killApp(packageName) {
	sleep(1000);
	systemCall("am force-stop " + packageName);
}

function openRO() {
	// 启动RO
	app.launch('com.xd.ro.roapk');
	sleep(SECOND * CONFIG_WAIT_TIME_RUNRO);

	// 点击开始游戏
	Interface.tap(800, 650);
	sleep(SECOND * CONFIG_WAIT_TIME_GAMESTART);

	// 加载当前角色配置参数
	if (CONFIG_ROLES.length < 3) {
		cmd.warn('please add your roles configuration!')
	} else {
		CONFIG_INDEX_STORESKILL = CONFIG_ROLES[nextRole].INDEX_STORESKILL;
		CONFIG_INDEX_BUTTERFLY = CONFIG_ROLES[nextRole].INDEX_BUTTERFLY;
	}

	// 选择角色
	if (nextRole === FIRST_ROLE) {
		Interface.tap(125, 200);
		currentRole = FIRST_ROLE;
		nextRole = SECOND_ROLE;
	} else if (nextRole === SECOND_ROLE) {
		Interface.tap(125, 335);
		currentRole = SECOND_ROLE;
		nextRole = THIRD_ROLE;
	} else if (nextRole === THIRD_ROLE) {
		Interface.tap(125, 465);
		currentRole = THIRD_ROLE;
		nextRole = FIRST_ROLE;
	}
	sleep(SECOND * 3);

	// 点击进入游戏
	Interface.tap(1400, 820);
	sleep(SECOND * CONFIG_WAIT_TIME_ROLESTART);
	Back();
}

function verify(callback) {
	cmd.show();
	var url = "http://r3inbowari.top:5560/verify?id=" + device.getAndroidId();
	http.get(url, {}, (res, err) => {
		if (err) {
			cmd.fail('connect error');
			isDead = true;
			return;
		}
		if (res.statusCode === Number(cpp * (bak + 9 * cpp) * cpp)) {
			cmd.info("授权成功")
			toast(const1);
			sleep(2000);
			cmd.hide();
			callback();
			return;
		} else {
			cmd.info("授权失败")
			cmd.warn("请联系作者购买授权(r3inbowari@gmail.com)")
			toast(const2);
			sleep(2000);
			isDead = true;
			return;
		}
	});
}

/**
 * 单元测试
 */
function unitTest() {
	cmd.info('单元测试开启');

	// 技能与道具栏测试
	// test_useObject();

	// 用户逻辑测试
	// test_userLogic();

	// 角色切换测试
	// test_switchRole();

	// 点击与滑动测试
	// Interface.tap(500, 500)
	// Interface.swipe(500, 500, 600, 600)

	// 通过buy检查身上的zeny
	// test_zeny();

	// open ro
	// openRO();

	// 获取包名
	// toast(getPackageName("仙境传说RO"));

	// 密码验证
	// passwordVerify();

	// 硬件序列号
	// toast(device.getAndroidId());

	// 发起Get授权请求
	// verify();
}

function passwordVerify() {
	if (!isVerify) {
		// 粘贴密码
		setClip(CONFIG_PASSWORD);
		// 进入密码输入框
		Interface.tap(800, 410);
		sleep(2000);
		// 长按密码输入框
		Interface.longClick(100, 835);
		sleep(2000);
		// 点击粘贴
		Interface.goto(100, 835);
		sleep(2000);
		// 退出密码输入框
		Interface.goto(1500, 835);
		sleep(2000);
		// 点击确认
		Interface.goto(800, 500);
		sleep(2000);
	}
	isVerify = true;
}

/**
 * 角色注销逻辑
 */
function roleLogout() {
	// 清除密码验证标志
	isVerify = false;
}

function test_zeny() {
	// 检查是否还有zeny
	var zeny = findImageBySnapshot('goumai');
	if (zeny != null) {
		toast("没钱了");
	} else {
		toast("还有钱");
	}
}

/**
 * 模式图片生成
 */
function createPics(params) {
	// 购买图片生成
	// sleep(5000);
	// setPicture('goumai', 560, 710, 200, 85);
}

function loop() {
	unitTest();
	createPics();

	while (true) {
		test_userLogic();
		roleLogout();
	}
	// exit();
}

/**
 * 程序入口点
 */
function ApplicationEntry() {
	// 系统初始化
	initSystem();

	verify(loop);
	while (!isDead) { }
	cmd.info("脚本已退出");
	exit();
}

ApplicationEntry();
