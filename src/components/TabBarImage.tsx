import React from "react"
import { Image } from "react-native"


const credentials = require("../assets/images/credentials-icon.png")
const inactiveCredentials = require("../assets/images/credentials-icon-inactive.png")

export default function TabBarImage({ focused }: { focused: boolean }) {
    return (
        <>
            {focused
                ? <Image style={{ marginHorizontal: -7, marginVertical: -3 }} source={credentials} />
                : <Image style={{ marginHorizontal: -7, marginVertical: -3 }} source={inactiveCredentials} />
            }

        </>
    )
}

//         <Image source={credentials}></Image>
//     )
// }