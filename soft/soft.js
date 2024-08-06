function resultsSend(res) {
  return (results) => res.status(200).send(results);
}
function errorSend(res) {
  return (error) => res.status(404).send(error.message);
}

module.exports = {
  resultsSend,
  errorSend,
};
