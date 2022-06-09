import { Alert } from '../types'


const ALERT_KEY = '__ALERT__'
type StoredAlert = Alert & { display: boolean }

function show(alert: Alert) {
  const obj = {
    ...alert,
    display: true
  }

  get().value = obj
}

function get() {
  return useState<StoredAlert | undefined>(ALERT_KEY)
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
