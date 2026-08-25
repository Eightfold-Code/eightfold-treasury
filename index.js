export const name = 'hello-eightfold'

export function eightfoldHello(params = {}) {
  const target = typeof params.name === 'string' && params.name.length > 0 ? params.name : 'Dino'
  return `Hello ${target} from Eightfold.`
}

export function apply() {
  // Intentionally empty: this adaptation proves that a Treasury package can
  // mount as a native DeepSeek Harness/Cordis plugin layer.
}

export default apply
