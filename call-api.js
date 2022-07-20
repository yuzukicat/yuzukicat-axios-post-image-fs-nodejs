//To use the js file:
//npm install --save
//$sudo node call-api.js >> log-error.txt 2>&1
const https = require('https');
const FormData = require("form-data");
const fs = require('fs');
const axios = require('axios');
const fileName = './test.jpeg';
const formData = new FormData();
//Solve the issue: AxiosError: unable to verify the first certificate (UNABLE_TO_VERIFY_LEAF_SIGNATURE)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
fs.readFile(fileName, (err, buffer) => {
  if (err) {
    console.log(err);
  }
  //if your use aws s3, get the filename and extension infomation from s3 buffer to blob
  const filename = fileName.split('.')[fileName.split('.').length-2].replace(/[^\w\d_\-\.]+/ig, '');
  import('file-type/core').then(file_type => {
    file_type.fileTypeFromBuffer(buffer).then(res=>{
      const formObjectName = `${filename}.${res.ext}`;
      console.log(formObjectName);
      //formObjectName is required for an image-only api to infer file type
      formData.append('image', buffer, formObjectName);
      console.log(formData);
      axios({
        method: 'post',
        url: 'https://rateplating.online:8401/predict',
        data: formData,
        httpsAgent: httpsAgent
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.statusText);
        console.log(res.data);
        console.log(res.headers);
        console.log(res.config);
      })
      .catch((err) => {
        console.log(err);
      })
   })
  })
})
