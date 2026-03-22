export function checkEmail(email: string | null) {
  if (email == null) {
    return false
  }

  const expression: RegExp =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/

  const result: boolean = expression.test(email!)

  return result
}

export function isUrlValid(url: string): boolean {
  const pattern = new RegExp(
    '^(https?|ftp)://[A-Za-z0-9.-]+.[A-Za-z]{2,4}(:[0-9]+)?(/.*)?$',
  )
  return pattern.test(url)
}
