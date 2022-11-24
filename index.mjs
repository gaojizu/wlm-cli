#!/usr/bin/env node
import { Command } from 'commander'; //进行命令行的操作
const program = new Command();
import download from 'download-git-repo'; //使用插件进行下载远程仓库的项目
import inquirer from 'inquirer' //命令行交互插件 使用require的话 请进行安装8.0的版本 之后的版本不支持esm的模块
import handlebars from 'handlebars' //模板引擎 
import fs from 'fs' // 文件读取
import ora from 'ora' //添加loading效果
import chalk from 'chalk'; // 提示文字
import logSymbols from 'log-symbols'; //提示符号

import { templateObject } from './templates.js'
import { initAndCloneProject, downLoadTemplate } from './tools.js'
const log = console.log; // 声明log

/**
 * 
 * @param {*} templateObject 
 * @returns  当前模版数组
 */
const getTemplateList = (templateObject) => {
  let templateList = []
  for (let key in templateObject) {
    templateList.push(key)
  }
  return templateList
}


program
  .version('1.0.0');

program
  .command('atm')
  .action(() => {
    log(logSymbols.info, chalk.yellow(`ATM`))
  })

program
  .command('use')
  .description('如何使用wlm-cli')
  .action(() => {
    log(logSymbols.info, chalk.yellow('第一步：运行 wlm list'))
    log(logSymbols.info, chalk.yellow('第二步：运行 wlm init 模板名称 自定义名称'))
    log(logSymbols.info, chalk.yellow('第三步：按照步骤初始化模板即可'))
  })

program
  .command('help [command]')
  .description('帮助命令')

program
  .command('que')
  .description('询问')
  .action(() => {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "router",
          message: "是否安装路由?",
        },
        {
          type: "confirm",
          name: "eslint",
          message: "是否安装eslint?",
        },
        {
          type: "confirm",
          name: "pinia",
          message: "是否安装pinia",
        }
      ]).then(answers => {
        console.log(answers)
        // 写入文件
      }).catch(err => {
        console.log(err)
      })

  })

program
  .command('choice')
  .description('选择模板下载')
  .action(() => {
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "projectName",
          message: "请选择需要下载的模板",
          choices: getTemplateList(templateObject)
        }
      ]).then((answers) => {
        console.log(answers)
        downLoadTemplate(answers.projectName).then(() => {
          // 提示用户进入项目安装
          descriptionNextStep(answers.projectName)
        })
      }).catch(err => {
        console.log(err)
      })
  })

program
  .command('init <templateName> <projectName>')
  .description('初始化模板')
  .action((templateName, projectName) => {
    downLoadTemplate(templateName, projectName).then(() => {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: "请输入项目名称"
          }, {
            type: 'input',
            name: 'description',
            message: "请输入项目简介"
          }, {
            type: 'input',
            name: 'author',
            message: "请输入作者"
          }
        ])
        .then((answers) => {
          initAndCloneProject(projectName, answers).then(() => {
            descriptionNextStep(projectName)
          })
        })
        .catch((error) => {
          if (error.isTtyError) {
            log(logSymbols.error, chalk.red(error))
          } else {
            log(logSymbols.error, chalk.yellow(error))
          }
        });
    })
  });

program
  .command('list [command]')
  .description('当前可用模板列表')
  .action(() => {
    log(chalk.green('当前可用模板：\n'))
    for (let key in templateObject) {
      log(logSymbols.info, `模板名称：${key}`)
      log(logSymbols.info, `模板介绍：${templateObject[key].description}`)
      log(`\n`)
    }
  })

program.parse();
