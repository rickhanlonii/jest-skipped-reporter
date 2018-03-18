const jestUtils = require('jest-util');
const StdIo = require('./StdIo');

class SkippedReporter {
  constructor() {
    this.stdio = new StdIo();
    this.skipped = {};
    this.skippedCount = 0;
  }

  onRunStart(aggregatedResults, options) {
    if (jestUtils.isInteractive) {
      jestUtils.clearLine(process.stderr);
    }
  }

  onRunComplete() {
    if (this.skippedCount > 0) {
      const suites = Object.keys(this.skipped);
      this.stdio.log(
        `Skipped ${this.skippedCount} specs in ${suites.length} suites`
      );
      suites.forEach(path => {
        const skippedTestNames = this.skipped[path];
        this.stdio.log(`  Skipped ${skippedTestNames.length} specs in ${path}`);
        skippedTestNames.forEach(name => {
          this.stdio.log(`    - ${name}`);
        });
      });
    }
    this.stdio.close();
  }

  onTestResult(test, testResult) {
    if (testResult.numPendingTests > 0) {
      this.skipped[testResult.testFilePath] = testResult.testResults.reduce(
        (skipped, result) => {
          if (result.status === 'pending') {
            this.skippedCount += 1;
            skipped.push(result.fullName);
          }
          return skipped;
        },
        []
      );
    }
  }
}

module.exports = SkippedReporter;
