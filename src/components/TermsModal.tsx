import React from "react"
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { TERMS_AND_CONDITIONS_CONTENT } from "../constants/Text"
import { StyledButton } from "./styles/StyledButton.styles"

export default function TermsModal(props: {
    visible: boolean,
    modalVisible: boolean
    onClose: any
    onRequestClose: any
    setChecked: any
}) {

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => props.onRequestClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Terms and Conditions</Text>
                        <ScrollView>
                            <Text>{TERMS_AND_CONDITIONS_CONTENT}</Text>
                            <StyledButton
                                mode='contained'
                                uppercase={false}
                                labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                                onPress={() => {
                                    props.onClose()
                                }}
                            >
                                I agree
                            </StyledButton>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
