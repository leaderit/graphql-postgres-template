
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
    ///
    copyFile:
    `
      mutation CopyFile(
        $storage: String!, 
        $path: String = "", 
        $name: String!,
        $to_storage: String!,
        $to_path: String = "", 
        $to_name: String!
      ) {
        storage_cpfile(
          storage: $storage, 
          path: $path,
          name: $name, 
          to_storage: $to_storage, 
          to_path: $to_path, 
          to_name: $to_name
        ) {
          error
          success
        }
      }    
    `,      
    ///
    moveFile:
    `
      mutation MoveFile(
        $storage: String!, 
        $path: String = "", 
        $name: String!,
        $to_storage: String!,
        $to_path: String = "", 
        $to_name: String!
      ) {
        storage_mvfile(
          storage: $storage, 
          path: $path,
          name: $name, 
          to_storage: $to_storage, 
          to_path: $to_path, 
          to_name: $to_name
        ) {
          error
          success
        }
      }    
    `,
}
    
    
    