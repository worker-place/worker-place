import { Alert } from '../types'


const ALERT_KEY = '__ALERT__'

function show(alert: Alert) {
  get().value = alert
}

function get() {
  return useState<Alert | undefined>(ALERT_KEY)
}

function destroy() {
  get().value = undefined
}

export default function() {
  return {
    destroy,
    get,
    show
  }
}
