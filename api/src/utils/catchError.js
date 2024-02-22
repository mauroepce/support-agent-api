// envuelve las funciones y las retorna con un catch por si ocurre un error cachearlo
module.exports = (fn) => (req, res, next) =>
  fn(req, res).catch((err) => next(err))
