
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
    newStorage:
    `
      mutation NewStorage(
          $storage: String!, 
          $region: String!
        ) {
        storage_new(
          region: $region, 
          storage: $storage
        ) {
          error
          success
        }
      }
    `,
    ///
    removeStorage:
    `
      mutation MyMutation($storage: String!) {
        storage_rm(storage: $storage) {
          error
          success
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
    fileUrl:
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
      `,
    ///
    removeFile: 
      `
      mutation RemoveFile(
        $name: String!, 
        $path: String = "", 
        $storage: String!
      ) {
        storage_rmfile(storage: $storage, path: $path, name: $name) {
          error
          success
        }
      }        
      `,

}
    
    
    