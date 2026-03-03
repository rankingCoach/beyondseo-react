const { deleteFilesInADir } = require("../file-utils");
const deleteModels = async () => {
  await deleteFilesInADir(`./src/models/swagger/`);
};

module.exports = {
  deleteModels,
};
