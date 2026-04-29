export const TEST_USER_EMAIL = 'test@test.com'
export const TEST_USER_PASSWORD = 'secret123'

export async function getAuthToken(client: {
  post: (url: string, data?: Record<string, unknown>) => {
    json: () => {
      response: { body: { token?: string } }
      status(): number
    }
  }
}): Promise<string> {
  const response = await client.post('/auth/login', {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  }).json()

  return response.response.body.token!
}
