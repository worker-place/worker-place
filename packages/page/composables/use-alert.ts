import { Alert } from '../types'


const ALERT_KEY = '__ALERT__'
type StoredAlert = Alert & { display: boolean }

export default function(alert: Alert) {
  const obj = {
    ...alert,
    display: true
  }

  useState<StoredAlert>(ALERT_KEY, () => obj)
}
