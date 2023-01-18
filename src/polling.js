module.exports = {
	getUrl() {
		return `http://${this.config.ip}:${this.config.httpServerPort}/feedback`
	},

	initPolling() {
		if (this.data.interval) {
			clearInterval(this.data.interval)
		}
		if (!this.config.feedbackPolling) {
			return
		}
		if (this.config.ip && this.config.httpServerPort && this.config.pollingInterval) {
			this.data.interval = setInterval(() => {
				this.system.emit('rest_get', this.getUrl(), (err, result) => {
					if (err !== null) {
						this.log('error', `HTTP GET Request failed (${result.error.code})`)
						this.updateStatus('connection_failure', result.error.code)
						return
					}
					if (
						result.response.statusCode === 200 &&
						result.response.headers['content-type'] === 'application/json' &&
						result.response.headers['content-length'] > 0
					) {
						this.updateVariables(result.data)
						this.updateStatus('ok')
					}
				})
			}, this.config.pollingInterval)
		}
	},
}
