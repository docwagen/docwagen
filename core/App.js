const { Unoserver } = require("@docwagen/unoserver-node");
const {
  FILE_UPLOAD_DIR,
  CONVERTED_FILES_DIR,
  APP_NAME,
} = require("../constants");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const debugFactory = require("debug");
const { isPromise } = require("util/types");

class App {
  static shouldDebug = true;
  static isUnoserverAlive = false;

  static async run() {
    const debug = this.getDebug();

    this.printBanner();

    if (!this.isUploadDirCreated()) {
      debug("file upload dir not found, attempting to create...");
      fs.mkdir(FILE_UPLOAD_DIR, (err) => {
        if (err) {
          debug(`Error occurred during file upload dir creation:\n${err}`);
          throw err;
        }
      });
    }

    if (!this.isConvertedFilesDirCreated()) {
      debug("converted files dir not found, attempting to create...");
      fs.mkdir(CONVERTED_FILES_DIR, (err) => {
        if (err) {
          debug(`Error occurred during converted files dir creation:\n${err}`);
          throw err;
        }
      });
    }
    // typically soffice is always alive if unoserver is alive
    const isUnoserverAlive = await this.isUnoserverRunning();
    if (isUnoserverAlive) {
      debug(`Unoserver still running, skipping re-run attempt`);
      return true;
    }
    // run unoserver as daemon
    debug(`Unoserver not running, attempting to run as daemon...`);
    return await this.runUnoserver();
  }

  static async runUnoserver() {
    const debug = this.getDebug();
    const unoserverProcess = new Unoserver(true).makeDaemon().run();
    if (isPromise(unoserverProcess)) {
      unoserverProcess
        .then((data) => debug(`result from unoserver execution: ${data}`))
        .catch((err) => debug(`Running unoserver erroerd:\n${err}`));
    }
    debug(`confirming that unoserver is now running...`);
    const isAlive = await this.isUnoserverRunning();
    if (isAlive) {
      debug(`Unoserver now running: ${new Date()}`);
    }
    return isAlive;
  }

  static async isRunning() {
    // app is running if:
    // file upload folder exists
    const fileUploadDirExists = this.isUploadDirCreated();
    // conversion folder exists
    const convertedFilesDirExists = this.isConvertedFilesDirCreated();
    // the unoserver process is running
    // unoserver can be connected to i.e. is accepting connections
    const isUnoserverRunning = await this.isUnoserverRunning();

    return fileUploadDirExists && convertedFilesDirExists && isUnoserverRunning;
  }

  static isUploadDirCreated() {
    return fs.existsSync(FILE_UPLOAD_DIR);
  }

  static isConvertedFilesDirCreated() {
    return fs.existsSync(CONVERTED_FILES_DIR);
  }

  static async isUnoserverRunning() {
    let isRunning = false;
    // check that the unoserver process is up
    const { stdout, stderr } = await this.execGrep("ps -e | grep unoserver");
    if (stderr.length) {
      throw new Error(
        `Error encountered during unoserver alive check:\n${stderr}`
      );
    }

    isRunning = this.isUnoserverAlive = stdout.length ? true : false;
    // confirm that it is accepting connections on the host and port

    return isRunning;
  }

  static async isSofficeRunning() {
    // check that soffice process is up
    const { stdout, stderr } = await this.execGrep("ps -e | grep soffice");
    if (stderr.length) {
      throw new Error(
        `Error encountered during soffice alive check:\n${stderr}`
      );
    }
    return stdout.length ? true : false;
  }

  /**
   * Kill long running unoserver process and the underlying long-running libreoffice instance.
   * Sends a SIGTERM signal to unoserver. According to: https://github.com/unoconv/unoserver/issues/9#issuecomment-1011990482
   * sending a SIGTERM forces unoserver to terminate nicely with it's spawned processes
   */
  static async killUnoserver() {
    const { stdout, stderr } = await this.execCmd("pkill -TERM unoserver");
    if (stderr.length) {
      throw new Error(
        `Error encountered during attempt to kill Unoserver & its subprocesses:\n${stderr}`
      );
    }
    return true;
  }

  static async killUnoserverAndSoffice() {
    // kill them using the cmd name. Later this could be changed to using the PGID
    const { stdout, stderr } = await this.execCmd(
      "pkill -INT unoserver; pkill -INT soffice"
    );
    if (stderr.length) {
      throw new Error(
        `Error encountered during kill attempt of unoserver and soffice:\n${stderr}`
      );
    }
    // pkill doesn't print to stdout
    return true;
  }

  /**
   * Grep returns an exit code of 1 (operation not permitted) when it does not find the argument specified for it
   * and returns an exit code of 0 on success. For grep commands, this method checks the exit code and sets
   * `stdout` to an empty string
   * @param {string} grepCmd
   */
  static async execGrep(cmd) {
    const debug = this.getDebug();
    debug(`Running command via exec: ${cmd}`);
    let stdout = "";
    let stderr = "";
    try {
      ({ stdout, stderr } = await exec(cmd));
      debug(`stdout: ${stdout}`);
      debug(`stderr: ${stderr}`);
    } catch (err) {
      if (err.code > 1) {
        debug(`Error occurred during execution of command: ${cmd}`);
        console.error(err);
        throw err;
      }
      stdout = err.stdout;
      stderr = err.stderr;
    }

    return { stdout, stderr };
  }

  static async execCmd(cmd) {
    const debug = this.getDebug();
    debug(`Running command via exec: ${cmd}`);
    const { stdout, stderr } = await exec(cmd);
    debug(`stdout: ${stdout}`);
    debug(`stderr: ${stderr}`);

    return { stdout, stderr };
  }

  static getDebug() {
    const appDebug = debugFactory(APP_NAME);
    if (this.shouldDebug) {
      debugFactory.enable(APP_NAME);
    }
    return appDebug;
  }

  static disableDebug() {
    this.shouldDebug = false;
  }

  static enableDebug() {
    this.shouldDebug = true;
  }

  static printBanner() {
    // don't alter the string, might change the text
    // ascii art from: https://edukits.co/text-art/
    console.log("oooooooooo.                       oooooo   oooooo     oooo");
    console.log("`888'   `Y8b                       `888.    `888.     .8'");
    console.log(
      "  888      888  .ooooo.   .ooooo.    `888.   .8888.   .8'    .oooo.    .oooooooo  .ooooo.  ooo. .oo."
    );
    console.log(
      "  888      888 d88' `88b d88' `\"Y8    `888  .8'`888. .8'    `P  )88b  888' `88b  d88' `88b `888P\"Y88b"
    );
    console.log(
      "  888      888 888   888 888           `888.8'  `888.8'      .oP\"888  888   888  888ooo888  888   888"
    );
    console.log(
      "  888     d88' 888   888 888   .o8      `888'    `888'      d8(  888  `88bod8P'  888    .o  888   888"
    );
    console.log(
      " o888bood8P'   `Y8bod8P' `Y8bod8P'       `8'      `8'       `Y888\"\"8o `8oooooo.  `Y8bod8P' o888o o888o"
    );
    console.log(
      '                                                                      d"     YD'
    );
    console.log(
      "                                                                      \"Y88888P'"
    );
  }
}

module.exports = App;
