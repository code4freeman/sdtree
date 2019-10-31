"use strict"

const getTree = require("./lib/getDirTree");
const buildTreeStr = require("./lib/buildTreeString");

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