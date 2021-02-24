
module.exports = {
    ///
    storages: 
        `
        query StorageFiles {
            storages {
            creationDate
            name
            }
        }      
        `,
    ///
    files:
      `
      query StorageFiles ($path: String! = "", $storage: String! ="") {
        storage_files(path: $path, storage: $storage) {
          is_directory
          name
          size
        }
      }      
      `,
    // variables: {
    //     "path":"",
    //     "storage":"users"
    // }    
    ///
    newFile:
      `
      mutation StorageNewFile(
          $path: String! = "", 
          $name: String, 
          $storage: String! = "users") {
        storage_newfile(
            path: $path, 
            storage: 
            $storage, name: $name
        ) {
          url
        }
      }
      
      `,
    ///
      fileurl:
        `
        query StorageFileUrl(
                $path: String! = "", 
                $name: String! = "", 
                $storage: String! = ""
            ) {
            storage_fileurl(path: $path, storage: $storage, name: $name) {
                url
            }
        }            
        `
    ///
    }
    
    
    