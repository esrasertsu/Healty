import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef, useContext } from "react";
import { RootStoreContext } from "../../stores/rootStore";

const FilesUpload = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadTrainerDocuments,uploadFile} = rootStore.commonStore;
  const {profile} = rootStore.profileStore;

  const [selectedFiles, setSelectedFiles] = useState<any[]>();
  const [progressInfos, setProgressInfos] = useState<any>({ val: [] });
  const [message, setMessage] = useState<string[]>([]);
  const [fileInfos, setFileInfos] = useState<any[]>([]);
  const progressInfosRef = useRef<any>()

  const selectFiles = (event:any) => {
    setSelectedFiles(event.target.files);
    setProgressInfos({ val: [] });
  };

  const uploadFiles = () => {
    const files = Array.from(selectedFiles!);

    let _progressInfos = files.map(file => ({ percentage: 0, fileName: file.name }));

    progressInfosRef.current = {
      val: _progressInfos,
    }

    const uploadPromises = files.map((file, i) => upload(i, file));

    Promise.all(uploadPromises)
      .then(() => loadTrainerDocuments(profile!.userName))
      .then((files:any) => {
        setFileInfos(files);
      });

    setMessage([]);
  };

  const upload = (idx:number, file:File) => {
    let _progressInfos = [...progressInfosRef.current.val];
    return uploadFile(profile!.userName,file, (event:any) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total
      );
      setProgressInfos({ val: _progressInfos });
    })
      .then(() => {
        setMessage((prevMessage) => ([
          ...prevMessage,
          "Uploaded the file successfully: " + file.name,
        ]));
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        setProgressInfos({ val: _progressInfos });

        setMessage((prevMessage) => ([
          ...prevMessage,
          "Could not upload the file: " + file.name,
        ]));
      });
  };

  useEffect(() => {
    profile && loadTrainerDocuments(profile.userName).then((response:any) => {
      setFileInfos(response.data);
    });
  }, []);

  return (
    <div>
    {progressInfos && progressInfos.val.length > 0 &&
      progressInfos.val.map((progressInfo:any, index:any) => (
        <div className="mb-2" key={index}>
          <span>{progressInfo.fileName}</span>
          <div className="progress">
            <div
              className="progress-bar progress-bar-info"
              role="progressbar"
              aria-valuenow={progressInfo.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: progressInfo.percentage + "%" }}
            >
              {progressInfo.percentage}%
            </div>
          </div>
        </div>
      ))}

    <div className="row my-3">
      <div className="col-8">
        <label className="btn btn-default p-0">
          <input type="file" multiple onChange={selectFiles} />
        </label>
      </div>

      <div className="col-4">
        <button
          className="btn btn-success btn-sm"
          disabled={!selectedFiles}
          onClick={uploadFiles}
        >
          Upload
        </button>
      </div>
    </div>

    {message.length > 0 && (
      <div className="alert alert-secondary" role="alert">
        <ul>
          {message.map((item, i) => {
            return <li key={i}>{item}</li>;
          })}
        </ul>
      </div>
    )}

    <div className="card">
      <div className="card-header">List of Files</div>
      <ul className="list-group list-group-flush">
        {fileInfos &&
          fileInfos.map((file, index) => (
            <li className="list-group-item" key={index}>
              <a href={file.url}>{file.name}</a>
            </li>
          ))}
      </ul>
    </div>
  </div>
  );
};

export default observer(FilesUpload);
