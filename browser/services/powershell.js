'use strict';

const fs = require('fs-extra');
const pify = require('pify');
const tmp = require('tmp');
const writeFile = pify(fs.writeFile);
const child_process = require('child_process');
const execFile = pify(child_process.execFile);

class  PowerShell {

  /**
   * Method saves script text to temp file and then executes it
   * @param {string} script - script to execute
   */
  static execScriptText(script) {
    let tempFileLocation = tmp.tmpNameSync({postfix: '.ps1'});
    return writeFile(tempFileLocation, script).then(()=>{
      return PowerShell.execScriptFile(tempFileLocation);
    });
  }

  static execScriptFile(scriptLocation) {
    let opts = [
      '-ExecutionPolicy',
      'ByPass',
      '-File',
      scriptLocation
    ];
    return execFile('powershell', opts, {'maxBuffer': 1024*1024*2});
  }

  static addToPath(location) {
    const data = [
      '$newPath = "' + location + '";',
      '$oldPath = [Environment]::GetEnvironmentVariable("path", "User");',
      '[Environment]::SetEnvironmentVariable("Path", "$newPath;$oldPath", "User");',
      '[Environment]::Exit(0)'
    ].join('\r\n');
    return PowerShell.execScriptText(data);
  }

}

export default PowerShell;
