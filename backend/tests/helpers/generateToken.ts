import jwt from 'jsonwebtoken'

export const generateTestToken = (userId: number): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET!
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '1h',
  })
}