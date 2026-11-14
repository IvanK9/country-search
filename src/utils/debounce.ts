export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  void fn;
  void delay;
  return () => {};
}
