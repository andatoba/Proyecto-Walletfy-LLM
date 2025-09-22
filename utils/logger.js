class Logger {
  static getTimestamp() {
    return new Date().toISOString();
  }

  static formatMessage(level, message, extra = '') {
    const timestamp = this.getTimestamp();
    const extraStr = extra ? ` ${extra}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${extraStr}`;
  }

  static info(message, extra = '') {
    const formatted = this.formatMessage('info', message, extra);
    console.log(`\x1b[36m${formatted}\x1b[0m`); // Cyan
  }

  static success(message, extra = '') {
    const formatted = this.formatMessage('success', message, extra);
    console.log(`\x1b[32m${formatted}\x1b[0m`); // Green
  }

  static warn(message, extra = '') {
    const formatted = this.formatMessage('warn', message, extra);
    console.log(`\x1b[33m${formatted}\x1b[0m`); // Yellow
  }

  static error(message, error = '') {
    const formatted = this.formatMessage('error', message, error);
    console.log(`\x1b[31m${formatted}\x1b[0m`); // Red
    if (error && error.stack) {
      console.log(`\x1b[31m${error.stack}\x1b[0m`);
    }
  }

  static database(message, extra = '') {
    const formatted = this.formatMessage('database', message, extra);
    console.log(`\x1b[35m${formatted}\x1b[0m`); // Magenta
  }

  static request(method, url, statusCode, responseTime) {
    const timestamp = this.getTimestamp();
    const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`${color}[${timestamp}] [REQUEST] ${method} ${url} - ${statusCode} (${responseTime}ms)\x1b[0m`);
  }
}

export default Logger;