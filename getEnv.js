module.exports = (name) => {
  if (process.env[name]) {
    return process.env[name]
  }
  throw new Error(`Missing env var: ${name}`)
}
