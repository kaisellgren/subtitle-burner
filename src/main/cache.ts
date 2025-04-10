export class Cache {
  #cache: Map<string, unknown> = new Map()

  async getOrRetrieve<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.#cache.has(key)) {
      return this.#cache.get(key) as T
    }
    const value = await fn()
    this.#cache.set(key, value)
    return value
  }
}
