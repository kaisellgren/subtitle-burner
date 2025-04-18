import { app } from '../dsl/app'

describe('Main', () => {
  test('Has expected title', async () => {
    expect(await app.title()).toEqual('Subtitle Burner')
  })
})
