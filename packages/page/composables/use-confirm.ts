import { Confirm } from '../types'


const CONFIRM_KEY = '__CONFIRM__'

function show(confirm: Confirm) {
  get().value = confirm
}

function get() {
  return useState<Confirm | undefined>(CONFIRM_KEY)
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
