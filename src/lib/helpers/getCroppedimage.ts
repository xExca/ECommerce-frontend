export const getCroppedImg = (imageSrc: string, croppedAreaPixels: any): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No 2d context");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to Blob (Binary) instead of DataURL (Base64)
      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        resolve(blob);
      }, "image/jpeg", 0.9);
    };

    image.onerror = (err) => reject(err);
  });
};