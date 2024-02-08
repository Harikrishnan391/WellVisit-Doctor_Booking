const formDataToSend = new FormData();

for (const key in dataToUpdate) {
  formDataToSend.append(key, dataToUpdate[key]);
}
if (dataToUpdate.certificate) {
  for (let i = 0; i < dataToUpdate.certificate.length; i++) {
    formDataToSend.append(`certificate`, dataToUpdate.certificate[i]);
  }
}
console.log([...formDataToSend.entries()], "formData to send");