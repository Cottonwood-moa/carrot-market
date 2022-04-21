export default function ssrJson<T = any>(arg: T) {
  return JSON.parse(JSON.stringify(arg));
}
