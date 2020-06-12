import {writeFileSync} from 'fs'
import path from 'path'
import {homedir} from 'os'
import * as yargs from 'yargs'

import {ts} from 'ts-morph'

import extractFunctions from './index'

// .option('directory', {type: 'positional'})

const cli = yargs
  .option('out', {
    // TODO: figure out how to show the description on --help
    type: 'string',
    description: 'Out file path. If missing will write to stdout',
    hidden: false,
  })

const normalize = (p: string) => path.normalize(p.replace(/^~/, homedir()))

function main() {
  const {_: fileNames, out} = cli.argv

  if (fileNames.length !== 1) {
    cli.showHelp()
    process.exit(1)
  }

  const [directory] = fileNames

  const results = extractFunctions(normalize(directory), {
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
    },
  })

  if (!out) {
    console.log(JSON.stringify(results))
    return
  }

  const filePath = normalize(out)

  writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`Types writen to ${filePath}`)
}

module.exports = main
