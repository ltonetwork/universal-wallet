import LocalStorageService from './LocalStorage.service'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
import RNFS from 'react-native-fs';
import RNFetchBlob from "rn-fetch-blob";
import { Asset } from 'expo-asset';

export default class PackageService {

    public static unzipOwnable = async (documentPickerResponse: DocumentPickerResponse) => {
        const name = documentPickerResponse.name;
        const nameNoExtension = name.substring(0, name.indexOf('.zip'));
        const fileCopyUri = documentPickerResponse.fileCopyUri;
        const ownableTargetUri = `${fileCopyUri.substring(0, fileCopyUri.indexOf(name))}${nameNoExtension}/`;

        const targetPath = RNFS.DocumentDirectoryPath + `/${nameNoExtension}`;

        // path where assets, resolves to bundle-assets://threads/test.txt
        let myAsset= RNFetchBlob.fs.asset('threads/test.txt');

        unzip(`${fileCopyUri}/`, targetPath)
        .then(async (path) => {
          const directoryFiles = await RNFS.readDir(targetPath);
          for (let i = 0; i < directoryFiles.length; i++) {
            const file = directoryFiles[i];
            await LocalStorageService.storeData(file.name, file);
            if (file.name.endsWith(".js")) {
              RNFetchBlob.fs.stat(file.path)
                  .then((stats) => console.log(stats))
                  .catch((err) => {})

              await LocalStorageService.storeData(`${nameNoExtension}-bindgen`, file.path);
            }
          }
          console.log(`unzip completed at ${targetPath}`);
        })
        .then(async () => {
          await PackageService.addOwnableOption(nameNoExtension);
        })
        .catch((error) => {
          console.error(`\n\n unzip failed at ${targetPath} \n\n`)
          console.error(error)
        });
    }


    public static addOwnableOption = async (ownableName: string) => {
      var ownableOptions = await LocalStorageService.getData('ownable-options');
      console.log("existing ownable options: ", ownableOptions);
      if (!ownableOptions) {
        ownableOptions = [];
      }

      if (!ownableOptions.find(option => option.name === ownableName)) {
        const ownableOption = { 'name': ownableName, 'id': ownableOptions.length };
        console.log("ownable option: ", ownableOption);
        ownableOptions.push(ownableOption);
        await LocalStorageService.storeData('ownable-options', ownableOptions);
      } else {
        console.log("Ownable option already exists");
      }
    }
}
