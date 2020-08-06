"use strict"

/**
 * 升级使用自建命令行工具后
 * 这里将不再维护
 * 这里为历史遗留存在，之后的新增命令行功能不导出js api
 */

/**
 * @summary  commonjs导出模块
 */

const getTree = require("./modules/default/lib/getDirTree");
const buildTreeStr = require("./modules/default/lib/buildTreeString");

module.exports = {
	/**
	 * 获取目录的结构字符串表示
	 * 
	 * @param {Object} options {exclude: [], comment: ""}
	 * @return {String}
	 */
	getTreeStr (dir, options) {
		const json = getTree(dir, options);
		return buildTreeStr(json.tree[Object.keys(json.tree)[0]]);
	},

	/**
	 * 获取目录结构json 
	 * 
	 * @param {Object} options {exclude: [], comment: ""}
	 * @return {Object}
	 */
	getTreeJson (dir, options) {
		const json = getTree(dir, options);
		return json && json.tree;
	}
}