const { Base64 } = require('js-base64');
const FS = require('fs');
const MD5 = require('md5');
const Validator = require('validator');
const fileType = require('file-type');

// creates a base-64 encoded ASCII string from a "string" of binary data
function encodeBase64(base64) {
  if (!Validator.isBase64(base64)) {
    return null;
  }

  return Base64.encode(base64);
}

// decodes a string of data which has been encoded using base-64 encoding
function decodeBase64(base64) {
  if (!Validator.isBase64(base64)) {
    return null;
  }

  return Base64.decode(base64);
}

function getFileType(base64) {
  if (!Validator.isBase64(base64)) {
    return null;
  }

  const buffer = Buffer.from(base64, 'base64');
  return fileType(buffer);
}

async function saveFile(base64) {
  let success = false;
  let path = '';
  let err = {};

  const type = getFileType(base64);
  if (type === null) {
    err = new TypeError('String must be Base64 encoded.');

    return {
      success,
      err,
      path,
    };
  }

  const { ext } = type;
  switch (ext) {
    case 'png':
    case 'jpg':
    case 'gif': {
      const buffer = Buffer.from(base64, 'base64');
      const filename = MD5(buffer);
      path = `${__dirname}/../files/${filename}.${ext}`;

      try {
        await FS.writeFile(`${path}`, buffer);
      } catch (error) {
        return {
          success: false,
          err: error,
          path,
        };
      }

      success = true;
      break;
    }
    default:
      err = new TypeError('File must be jpg, png ot gif.');
      break;
  }

  return {
    success,
    err,
    path,
  };
}

async function removeFile(path) {
  try {
    FS.unlink(path);
    return {
      success: true,
      err: {},
    };
  } catch (err) {
    return {
      success: false,
      err,
    };
  }
}

module.exports = {
  encodeBase64,
  decodeBase64,
  getFileType,
  saveFile,
  removeFile,
};
