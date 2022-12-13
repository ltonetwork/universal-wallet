import React, { useEffect, useState } from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Card, Paragraph, Text} from 'react-native-paper'
import Spinner from '../../components/Spinner'
import { PROFILE } from '../../constants/Text'
import StorageService from '../../services/Storage.service'
import { CardsContainer, Content, Field, HiddenTitle, MainCard } from './ProfileScreen.styles'
import PressToCopy from "../../components/PressToCopy";
import LTOService from "../../services/LTO.service";
import {StyledButton} from "../../components/styles/StyledButton.styles";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {RootStackScreenProps} from "../../../types";

export default function ProfileScreen({ navigation }: RootStackScreenProps<'Profile'>) {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [accountInformation, setAccountInformation] = useState(Object.create(null))
    const [isKeyBlur, setIsKeyBlur] = useState<boolean>(true)
    const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)
    const [accountNickname, setAccountNickname] = useState<string>("")
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)

    const { address, publicKey, privateKey, seed } = accountInformation

    useEffect(() => {
        readStorage()
        getNickname()
    }, [])

    useEffect(() => {
        if (isKeyBlur) {
            setIsKeyBlur(false)
        }
        if (isSeedBlur) {
            setIsSeedBlur(false)
        }
    }, [])

    const deleteAccount = () => {
        setShowConfirmDelete(false)
        LTOService.deleteAccount().then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignUp' }],
            })
        })
    }

    const readStorage = () => {
        LTOService.getAccount()
            .then(account => {
                setAccountInformation(account)
                setIsLoading(false)
            })
            .catch(error => {
                throw new Error(`Error retrieving data. ${error}`)
            })
    }

    const getNickname = () => {
        StorageService.getItem('@userAlias')
            .then(data => setAccountNickname(data.nickname))
            .catch(error => {
                throw new Error(`Error retrieving data. ${error}`)
            })
    }

    return (
        <>
            {isLoading ? <Spinner /> :

                <CardsContainer>
                    <MainCard >
                        <Card.Content>
                            <Field>{PROFILE.NICKNAME}</Field>
                            <Content>{accountNickname}</Content>

                            <Field>{PROFILE.WALLET}</Field>
                            <PressToCopy value={address}>
                                <Content>{address}</Content>
                            </PressToCopy>

                            <Field>{PROFILE.PUBLIC_KEY}</Field>
                            <PressToCopy value={publicKey}>
                                <Content>{publicKey}</Content>
                            </PressToCopy>
                        </Card.Content>

                    </MainCard>

                    {!isKeyBlur ?
                        <TouchableOpacity onPress={() => setIsKeyBlur(!isKeyBlur)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <HiddenTitle>{PROFILE.DISCOVER_PRIVATEKEY}</HiddenTitle>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                        :
                        <PressToCopy onPress={() => setIsKeyBlur(!isKeyBlur)} value={privateKey}>
                            <MainCard>
                                <Card.Content>
                                    <Field>{PROFILE.PRIVATE_KEY}</Field>
                                    <Content>{privateKey}</Content>
                                </Card.Content>
                            </MainCard>
                        </PressToCopy>
                    }

                    {!isSeedBlur ?
                        <TouchableOpacity onPress={() => setIsSeedBlur(!isSeedBlur)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <HiddenTitle>{PROFILE.DISCOVER_PHRASE}</HiddenTitle>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                        :
                        <PressToCopy onPress={() => setIsSeedBlur(!isSeedBlur)} value={seed}>
                            <MainCard>
                                <Card.Content>
                                    <Field>{PROFILE.PHRASE}</Field>
                                    <Content>{seed}</Content>
                                </Card.Content>
                            </MainCard>
                        </PressToCopy>
                    }

                    <StyledButton
                        mode='text'
                        color='red'
                        uppercase={false}
                        labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                        onPress={() => setShowConfirmDelete(true)}
                    >
                        {PROFILE.DELETE_ACCOUNT}
                    </StyledButton>
                </CardsContainer>
            }
            <ConfirmationDialog
                danger={true}
                titleLabel={PROFILE.DELETE_ACCOUNT_LABEL}
                continueButtonLabel={PROFILE.DELETE_ACCOUNT}
                visible={showConfirmDelete}
                onCancel={() => setShowConfirmDelete(false)}
                onPress={() => deleteAccount()}
            >
                <Paragraph style={{ textAlign: 'justify', marginBottom: 10 }}>{PROFILE.DELETE_ACCOUNT_MESSAGE}</Paragraph>
                <Paragraph style={{ textAlign: 'justify', fontWeight: 'bold' }}>{PROFILE.DELETE_ACCOUNT_MESSAGE_2}</Paragraph>
            </ConfirmationDialog>
        </>
    )
}
