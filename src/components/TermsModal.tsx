import React from "react"
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { TERMS_AND_CONDITIONS_CONTENT } from "../constants/Text"
import { StyledButton } from "./styles/StyledButton.styles"
import { CenteredView, ModalView, ModalText } from '././styles/TermsModal.styles'

export default function TermsModal(props: {
    visible: boolean,
    modalVisible: boolean
    onClose: any
    onRequestClose: any
    setChecked: any
}) {

    return (
        <CenteredView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => props.onRequestClose}
            >
                <CenteredView>
                    <ModalView>
                        <ModalText>TERMS AND CONDITIONS</ModalText>
                        <ScrollView>
                            <ModalText>{TERMS_AND_CONDITIONS_CONTENT}</ModalText>
                            <CenteredView>
                                <StyledButton
                                    mode='contained'
                                    uppercase={false}
                                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                                    onPress={() => {
                                        props.onClose()
                                    }}>
                                    I agree
                                </StyledButton>
                            </CenteredView>
                        </ScrollView>
                    </ModalView>
                </CenteredView>
            </Modal>
        </CenteredView>
    )
}