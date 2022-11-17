import { LocalStorageService } from "./LocalStorageService";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';


export default class PackageService {


    public static unzipOwnable = async (documentPickerResponse: DocumentPickerResponse) => {
        console.log("unzipping ownable");
        console.log(documentPickerResponse);
        const name = documentPickerResponse.name;
        const nameNoExtension = name.substring(0, name.indexOf('.zip'));
        const type = documentPickerResponse.type;
        const uri = documentPickerResponse.uri;
        const fileCopyUri = documentPickerResponse.fileCopyUri;
        const ownableTargetUri = `${fileCopyUri.substring(0, fileCopyUri.indexOf(name))}${nameNoExtension}/`;

        console.log("PATH TARGET: ", ownableTargetUri);
        console.log("PATH SOURCE: ", fileCopyUri);

       console.log();

        unzip(fileCopyUri, ownableTargetUri)
        .then((path) => {
          console.log(`unzip completed at ${path}`)
        })
        .catch((error) => {
          console.error(error)
        })
    }
}
