import { Squad } from '../types'


const key = '__SQUAD__'

export default function() {
  return useState<Squad | undefined>(key)
}
