import React, { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});

  const handelChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handelSubmit = async e => {
    try {
      e.preventDefault();

      // to append the File() object currently stored in file
      // we append to "file" because thats what the backend is looking for
      const formData = new FormData();
      formData.append("file", file);

      // becaue were using a proxy, we dont have to specify base route
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log("Server error");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <>
      <form onSubmit={handelSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={handelChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </>
  );
}
