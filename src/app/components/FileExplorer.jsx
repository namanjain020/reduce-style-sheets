

const folderEntries = [
  {
    name: "some-image.png",
    type: "file",
    size: 3000,
    author: "John Doe",
    createdAt: "2020-12-01T10:23:00-03:00",
    modifiedAt: "2020-12-01T10:23:00-03:00",
  },
  {
    name: "assets",
    type: "folder",
    size: 0,
    author: "John Doe",
    createdAt: "2020-12-01T10:23:00-03:00",
    modifiedAt: "2020-12-01T10:23:00-03:00",
  },
]

const FileExplorer = () => (
  <ReactSimpleExporer
    entries={folderEntries}
  />
)

export default FileExplorer;
