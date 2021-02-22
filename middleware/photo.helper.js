const { text } = require("express");
const Jimp = require("jimp");
const resize = async (req, res, next) => {
  if (req.file) {
    try {
      const image = await Jimp.read(req.file.path);
      await image.scaleToFit(400, 400).write(req.file.path);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next(new Error("Image required"));
  }
};
const circle = async (req, res, next) => {
  if (req.file) {
    try {
      const image = await Jimp.read(req.file.path);
      image.circle().write(req.file.path);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next(new Error("Image required"));
  }
};
const printTextOnImage = async (req, res, next) => {
  if (req.file) {
    try {
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      const image = await Jimp.read(req.file.path);
      await image
        .print(
          font,
          10,
          10,
          {
            text: req.body.topText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
          },
          400,
          400
        )
        .write(req.file.path);
      next();
    } catch (e) {
      next(err);
    }
  } else {
    next(new Error("Image required"));
  }
};
const putTextOnImage = async (originalImagePath, outputMemePath, texts) => {
  if (originalImagePath) {
    try {
      const image = await Jimp.read(originalImagePath);
      const dimension = {
        width: image.bitmap.width,
        height: image.bitmap.height,
      };
      const promises = texts.map(async (text) => {
        const font = await Jimp.loadFont(
          Jimp[`FONT_SANS_${text.size}_${text.color}`]
        );
        await image.print(
          font,
          0,
          0,
          {
            text: text.content,
            alignmentX: Jimp[text.alignmentX],
            alignmentY: Jimp[text.alignmentY],
          },
          dimension.width,
          dimension.height
        );
      });
      await Promise.all(promises);
      await image.writeAsync(outputMemePath);
    } catch (err) {
      throw err;
    }
  } else {
    next(new Error("Image required"));
  }
};
module.exports = {
  resize,
  circle,
  printTextOnImage,
  putTextOnImage,
};
