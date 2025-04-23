// 形状引导公式 支持的公式
// val 100
// */ 100 100 100
// +- 100 100 100
// min 100 100 100
// max 100 100 100
// mid 100 100 100
export function calculateFmla(formula) {
  if (!formula) return undefined
  const parts = formula.split(' ')
  const operator = parts[0]
  const args = parts.slice(1).map(Number)

  switch (operator) {
    case 'val':
      if (args.length === 1) {
        return args[0]
      }
      break
    case '*/':
      if (args.length === 3) {
        return (args[0] * args[1]) / args[2]
      }
      break
    case '+-':
      if (args.length === 3) {
        return (args[0] + args[1]) - args[2]
      }
      break
    case 'min':
      if (args.length >= 2) {
        return Math.min(...args)
      }
      break
    case 'max':
      if (args.length >= 2) {
        return Math.max(...args)
      }
      break
    case 'mid':
      if (args.length === 3) {
        return Math.min(Math.max(args[0], args[1]), args[2])
      }
      break
    case 'sum':
      return args.reduce((acc, val) => acc + val, 0)
    case 'abs':
      if (args.length === 1) {
        return Math.abs(args[0])
      }
      break
    case 'mod':
      if (args.length === 2) {
        return args[0] % args[1]
      }
      break
    case 'div':
      if (args.length === 2 && args[1] !== 0) {
        return args[0] / args[1]
      }
      break
    case 'add':
      if (args.length === 2) {
        return args[0] + args[1]
      }
      break
    case 'sub':
      if (args.length === 2) {
        return args[0] - args[1]
      }
      break
    case 'mul':
      if (args.length === 2) {
        return args[0] * args[1]
      }
      break
    case 'eq':
      if (args.length === 2) {
        return args[0] === args[1] ? 1 : 0
      }
      break
    case 'gt':
      if (args.length === 2) {
        return args[0] > args[1] ? 1 : 0
      }
      break
    case 'lt':
      if (args.length === 2) {
        return args[0] < args[1] ? 1 : 0
      }
      break
    case 'ge':
      if (args.length === 2) {
        return args[0] >= args[1] ? 1 : 0
      }
      break
    case 'le':
      if (args.length === 2) {
        return args[0] <= args[1] ? 1 : 0
      }
      break
    default:
      console.error(`Unsupported fmla operator: ${operator}`)
  }
  return null
}
