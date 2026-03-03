const { deleteFilesInADir } = require("../file-utils");
const deleteMocks = async () => {
  await deleteFilesInADir(`./src/__mocks__/@stores/swagger`);
  await deleteFilesInADir(`./src/__mocks__/__model_mocks__`);
  return true;
};

module.exports = {
  deleteMocks,
};
