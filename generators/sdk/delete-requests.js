const { deleteFilesInADir } = require("../file-utils");
const deleteRequests = async () => {
  return await deleteFilesInADir(`./src/stores/swagger/`);
};

module.exports = {
  deleteRequests,
};
