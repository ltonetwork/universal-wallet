import * as React from 'react'
import { FAB, Portal, Provider } from 'react-native-paper'
import {useState} from "react"
import {WALLET} from "../constants/Text";

export default function WalletFAB(props: {transfer: () => void, lease: () => void}): JSX.Element {
    const [state, setState] = useState({ open: false })
    const { open } = state

    return (
        <Provider>
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'close' : 'plus'}
                    fabStyle={{backgroundColor: "#A017B7"}}
                    actions={[
                        {
                            icon: 'arrow-expand-up',
                            label: WALLET.TRANSFER,
                            onPress: props.transfer,
                            color: "#A017B7",
                            style: {backgroundColor: "#ede7f6"},
                            labelTextColor: "#000",
                            labelStyle: {backgroundColor: "#ede7f6"},
                        },
                        {
                            icon: 'bank-outline',
                            label: WALLET.LEASE,
                            onPress: props.lease,
                            color: "#A017B7",
                            style: {backgroundColor: "#ede7f6"},
                            labelTextColor: "#000",
                            labelStyle: {backgroundColor: "#ede7f6"},
                        },
                    ]}
                    onStateChange={setState}
                />
            </Portal>
        </Provider>
    )
}
