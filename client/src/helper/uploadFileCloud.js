const url = `https://api.cloudinary.com/v1_1/djncajt2f/auto/upload`;

export const uploadFileCloud = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat_app");

  const res = await fetch(url, {
    method: "post",
    body: formData,
  });
  const resData = await res.json();
  return resData;
};
