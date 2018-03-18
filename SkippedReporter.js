const jestUtils = require('jest-util');
const StdIo = require('./StdIo');

class SkippedReporter {
  constructor() {
    this.stdio = new StdIo();
  }

  onRunStart(aggregatedResults, options) {
    if (jestUtils.isInteractive) {
      jestUtils.clearLine(process.stderr);
    }
  }

  onRunComplete() {
    this.stdio.close();
  }

  onTestResult(test, testResult) {
    if (testResult.numPendingTests > 0) {
      this.stdio.log(
        `Skipped ${testResult.numPendingTests} specs in ${
          testResult.testFilePath
        }`
      );

      for (const result of testResult.testResults) {
        if (result.status === 'pending') {
          this.stdio.log(`  ${result.fullName}`);
        }
      }
    }
  }
}

module.exports = SkippedReporter;
