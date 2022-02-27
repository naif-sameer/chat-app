const date = new Date();
const nowDate = `${date.getHours()}-${date.getMinutes()}`;

function formatMessage(username, text) {
  return {
    username,
    text,
    time: nowDate,
  };
}

module.exports = { formatMessage };
