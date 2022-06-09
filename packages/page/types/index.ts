export interface User {
  avatar?: string
  id: string
  squadId?: string
  username: string
}

export interface Squad {
  id: string
  memberCount: number
  name: string
  nextPixel: number
  owner: string
}

export interface Alert {
  buttonColor?: string
  buttonText?: string
  closed?: () => void
  text: string
}

export interface Confirm {
  buttonColor?: string
  failure?: () => void
  success?: () => void
  task?: {
    errorMessage?: string
    instruction?: string
    validate: (input: string) => boolean
  }
  text: string
}
