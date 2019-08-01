import React, { useState } from "react";
import axios from "axios";
import ProgressBar from "./ProgressBar";

export default function FileUpload() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPctg, setUploadPctg] = useState(0);

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
        },
        onUploadProgress: ProgressEvent => {
          setUploadPctg(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );

          // Clear pctg
          setTimeout(() => setUploadPctg(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      console.log(res.data);
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
      <ProgressBar pctg={uploadPctg} />
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

      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center"> {uploadedFile.fileName} </h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} />
          </div>
        </div>
      ) : null}
    </>
  );
}
