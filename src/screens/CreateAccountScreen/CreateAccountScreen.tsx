import React, { useState } from "react"
import { RootStackScreenProps } from "../../../types"
import Spinner from "../../components/Spinner"
import { CenteredView } from "../../components/styles/Scanner.styles"
import { StyledButton } from "../../components/styles/StyledButton.styles"
import LocalStorageService from "../../services/LocalStorage.service"
import {
    ButtonContainer,
    Container,
    InputContainer,
    StyledText,
    StyledTitle
} from "../SignInScreen/SignInScreen.styles"

export default function CreateAccountScreen({ navigation }: RootStackScreenProps<"CreateAccount">) {
    const [isLoading, setIsLoading] = useState(true)

    const handleCreateAccount = () => {
        const LTO = require("@ltonetwork/lto").LTO
        const lto = new LTO("T")
        const account = lto.account()
        const auth = {
            "@context": "http://schema.lto.network/simple-auth-v1.json",
            url: "https://auth.lto.network/UkRihLPt8VA1",
        }
        const signature = account.sign(`lto:sign:${auth.url}`).base58
        const data = {
            address: account.address,
            privateKey: account.privateKey,
            publicKey: account.publicKey,
            seed: account.seed,
            signature,
        }

        if (data) {
            LocalStorageService.storeData("@accountData", data)
                .then(() => {
                    setIsLoading(false)
                    navigation.navigate("ImportAccount")
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        if (isLoading) {
            return (
                <CenteredView>
                    <Spinner />
                </CenteredView>
            )
        }

        return (
            <Container>
                <InputContainer>
                    <StyledTitle>Sign Up</StyledTitle>
                    <StyledText>Create and account or import one</StyledText>
                </InputContainer>

                <ButtonContainer>
                    <StyledButton
                        mode="contained"
                        color="#A017B7"
                        uppercase={false}
                        labelStyle={{ fontWeight: "400", fontSize: 16, width: "100%" }}
                        onPress={() => handleCreateAccount()}
                    >
                        Create new account
                    </StyledButton>
                    <StyledButton
                        mode="outlined"
                        uppercase={false}
                        labelStyle={{ fontWeight: "400", fontSize: 16, width: "90%" }}
                        onPress={() => navigation.navigate("ImportSeed")}
                    >
                        Import account with your seeds
                    </StyledButton>
                </ButtonContainer>
            </Container>
        )
    }
}
