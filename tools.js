/*
 * @use: 
 * @description: 
 * @SpecialInstructions: 无
 * @Author: clearlove
 * @Date: 2022-11-21 10:55:41
 * @FilePath: /lm-cli/tools.js
 */
import handlebars from 'handlebars' //模板引擎 
import chalk from 'chalk'; // 提示文字
import fs from 'fs' // 文件读取
import logSymbols from 'log-symbols'; //提示符号
import ora from 'ora' //添加loading效果
import download from 'download-git-repo'; //使用插件进行下载远程仓库的项目
import { templateObject } from './templates.js'

const log = console.log;
/**
 * @fucntion 重写并初始化package.json文件
 * @param {*} PN 项目名称
 * @param {*} PC package.json文件
 */
export const initAndCloneProject = (PN, PC = {}) => {
  console.log(PC)
  let init = ''
  init = new Promise((res, rej) => {
    const packagePath = `${PN}/package.json`
    const packageContent = fs.readFileSync(packagePath, 'utf8')
    const packageFinalValue = handlebars.compile(packageContent)(PC)
    log(chalk.green(packageFinalValue))
    fs.writeFileSync(packagePath, packageFinalValue)
    log(logSymbols.success, '初始化项目成功')
    res()
  })
  return init
}

/**
 * @function downLoadTemplate 下载项目
 * @param {*} TN 模板名称
 * @param {*} PN 项目自定义名称 函数会根据自定义名称进行项目重命名
 * @returns 
 */
export const downLoadTemplate = (TN = "", PN = "") => {
  const spinner = ora('模板获取中...').start();
  const { downloadUrl } = templateObject[TN]
  let down = ''
  if (downloadUrl) {
    down = new Promise((res, rej) => {
      setTimeout(() => {
        spinner.color = 'green';
        spinner.text = '模板链接获取成功，开始下载...';
      }, 1000)
      download(downloadUrl, PN || TN, { clone: true }, (err) => {
        if (err) {
          spinner.color = 'red';
          spinner.text = `模板获取失败，请重新操作,失败原因：${err}`;
          spinner.fail()
          rej(err)
          return
        }
        spinner.color = 'green';
        spinner.text = '模板下载成功';
        spinner.succeed()
        res(PN || TN)
      })
    })
  } else {
    spinner.color = 'red';
    spinner.text = '链接获取失败，请重新获取';
  }
  return down
}

/**
 * @funtion descriptionNextStep 描述最后应该的步骤 
 * @param {*} name 项目或者模板名称
 */
export const descriptionNextStep = (name) => {
  //TODO: 
  log(chalk.green(`cd ${name}`))
  log(chalk.green(`npm install`))
}