const fs = require("fs");
const path = require("path");

const writeFile = (path, data) => {
  fs.writeFile(path, data, function (err) {
    if (err) return console.log(err);
    console.log("Generated::", path);
  });
};

const createFolderIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

const readFile = (name, callback) => {
  fs.readFile(name, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    if (callback && typeof callback === "function") {
      callback(data);
    }
  });
};

const deleteFilesInADir = async (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, async (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      if (files && files.length > 0) {
        const unlinkPromises = files.map((file) => {
          const filePath = path.join(directory, file);

          return new Promise((resolve, reject) => {
            fs.stat(filePath, async (err, stats) => {
              if (err) reject(err);

              if (stats.isFile()) {
                fs.unlink(filePath, (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              } else if (stats.isDirectory()) {
                try {
                  await deleteFilesInADir(filePath);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              }
            });
          });
        });

        try {
          await Promise.all(unlinkPromises);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  writeFile,
  readFile,
  createDir,
  deleteFilesInADir,
  createFolderIfNotExists,
};
