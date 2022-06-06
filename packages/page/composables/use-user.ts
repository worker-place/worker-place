import { User } from '../types'


const key = '__USER__'

export default function() {
  return useState<User | undefined>(key)
}
