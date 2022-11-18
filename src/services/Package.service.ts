import LocalStorageService from './LocalStorage.service'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
import RNFS from 'react-native-fs';

export default class PackageService {

    public static unzipOwnable = async (documentPickerResponse: DocumentPickerResponse) => {
        const name = documentPickerResponse.name;
        const nameNoExtension = name.substring(0, name.indexOf('.zip'));
        const fileCopyUri = documentPickerResponse.fileCopyUri;
        const ownableTargetUri = `${fileCopyUri.substring(0, fileCopyUri.indexOf(name))}${nameNoExtension}/`;

        // TODO: async/await
        unzip(`${fileCopyUri}/`, ownableTargetUri)
        .then(async (path) => {
          console.log(`unzip completed at ${path}`)
          const directoryFiles = await RNFS.readDir(ownableTargetUri);
          for (let i = 0; i < directoryFiles.length; i++) {
            const file = directoryFiles[i];
            console.log("\n Storing file in local storage: ", file);
            await LocalStorageService.storeData(file.name, file);
          }
        })
        .then(async () => {
          await LocalStorageService.storeData(`${nameNoExtension}-uri-path`, fileCopyUri);
          await PackageService.addOwnableOption(nameNoExtension);
        })
        .catch((error) => {
          console.error(`\n\n unzip failed at ${fileCopyUri} \n\n`)
          console.error(error)
        })
    }

    public static addOwnableOption = async (ownableName: string) => {
      var ownableOptions = await LocalStorageService.getData('ownable-options');
      if (!ownableOptions) {
        ownableOptions = [];
      }

      if (!ownableOptions.find(option => option.name === ownableName)) {
        ownableOptions.push({ 'name': ownableName, 'id': ownableOptions.size });
        await LocalStorageService.storeData('ownable-options', ownableOptions);
      }
    }
}
