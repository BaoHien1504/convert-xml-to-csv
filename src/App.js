import React, { useRef, useState } from "react";

const App = () => {
  const [tags, setTags] = useState([]);
  const [mergedTags, setMergedTags] = useState([]);
  const [file, setFile] = useState();
  const dropAreaRef = useRef(null);
  const uploadFile = useRef(null);

  const onChooseFile = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    // Handle file
    reader.onload = function (e) {
      const contents = e.target.result,
        parser = new DOMParser(),
        xmlDoc = parser.parseFromString(contents, "text/xml");
      const tags = onGetTags(xmlDoc);
      setTags(tags);
    };
    reader.readAsText(file);
  };

  const handleReadXML = () => {
    console.log({ tags });
    const _mergedTags = [];
    const _tags = JSON.parse(JSON.stringify(tags));
    console.log(_tags);

    const onMergeTags = (array) => {
      array.forEach((item) => {
        if (item.tagChildren) {
          const { tagChildren } = item;
          const _tagChildren = tagChildren.reduce((children, currentChild) => {
            // If children does not exist currentChild.tagName => push
            const duplicatedIndex = children.findIndex(
              (item) => item.tagName === currentChild.tagName
            );
            if (duplicatedIndex < 0) {
              children.push(currentChild);
              if (currentChild.tagChildren) {
                onMergeTags(currentChild.tagChildren);
              }
              return children;
            }
            if (
              children[duplicatedIndex].tagChildren &&
              currentChild.tagChildren
            ) {
              children[duplicatedIndex].tagChildren = [
                ...children[duplicatedIndex].tagChildren,
                ...currentChild.tagChildren,
              ];
            }

            return children;
          }, []);
          item.tagChildren = _tagChildren;
          onMergeTags(item.tagChildren);
        }
      });
    };

    onMergeTags(_tags);
    console.log({ _tags });
  };

  const onGetTags = (element) => {
    const children = [];
    // console.log(element);
    if (element.children.length === 0) {
      children.push({ tagName: element.tagName });
      return children;
    }
    for (const item of element.children) {
      if (item.children.length > 0) {
        // const _children = item.children.reduce((prev, current) => {
        //   const currentNode = {
        //     tagName: current.tagName.toLowerCase(),
        //     children: current.children.map((item) =>
        //       item.tagName.toLowerCase()
        //     ),
        //   };
        //   const currentNodeJson = JSON.stringify(currentNode);
        //   if (!JSON.stringify(prev).includes(currentNodeJson)) {
        //     prev.push(currentNode);
        //   }
        //   return prev;
        // }, []);
        // console.log(_children);
        children.push({
          tagName: item.tagName,
          tagChildren: onGetTags(item),
        });
      } else {
        children.push({ tagName: item.tagName });
      }
    }
    return children;
  };

  return (
    <div className="App">
      <div id="ReadResult"></div>
      <div className="container">
        <div className="wrapper">
          <div className="card shadow">
            <h2>Upload File</h2>
            <div className="drop-box" ref={dropAreaRef}>
              <input
                type="file"
                hidden
                accept=".xml"
                id="fileinput"
                ref={uploadFile}
                onChange={onChooseFile}
                style={{ display: "none" }}
              />
              <div className="uploading">
                {file ? (
                  <h3>{file.name}</h3>
                ) : (
                  <>
                    <h4>Select file here</h4>
                    <p>File supported: XML</p>
                  </>
                )}
              </div>

              <button
                className="submit"
                onClick={() => {
                  uploadFile.current.click();
                }}
              >
                Choose File
              </button>
            </div>
          </div>
          {file && (
            <div className="buttons">
              <button
                type="button"
                className="button shadow"
                onClick={handleReadXML}
              >
                Get Data
              </button>
              <button
                type="button"
                className="button shadow"
                // onClick={downloadCSV}
              >
                Download CSV
              </button>
            </div>
          )}
          <div className="result">
            <table id="id"></table>
            <div id="items"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
