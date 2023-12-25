export const getBlobImg = (file: File): Promise<{ url: string; id: number }> =>
  new Promise((resolve, reject) => {
    try {
      if (!file) return;

      const reader = new FileReader();

      const objURL = URL.createObjectURL(file);

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve({
          url: objURL,
          id: file.lastModified,
        });
      };
    } catch (error) {
      reject(error);
    }
  });
