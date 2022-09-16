import React from "react"
import { Modal, ScrollView } from "react-native"
import { TERMS_AND_CONDITIONS_CONTENT } from "../constants/Text"
import { Container, ModalText, ModalView } from '././styles/TermsModal.styles'
import { StyledButton } from "./styles/StyledButton.styles"


export default function TermsModal(props: {
    visible: boolean,
    onClose: any
    onRequestClose: any
}): JSX.Element {

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => props.onRequestClose()}
        >
            <Container>
                <ModalView>
                    <ModalText>TERMS AND CONDITIONS</ModalText>
                    <ScrollView>
                        <ModalText>{TERMS_AND_CONDITIONS_CONTENT}</ModalText>
                        <Container>
                            <StyledButton
                                mode='contained'
                                color="#A017B7"
                                uppercase={false}
                                labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                                onPress={() => {
                                    props.onClose()
                                }}>
                                I agree
                            </StyledButton>
                        </Container>
                    </ScrollView>
                </ModalView>
            </Container>
        </Modal>

    )
}