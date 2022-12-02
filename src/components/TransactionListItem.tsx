import React from 'react'
import {shortAddress} from "../utils/shortAddress";
import {ActivityIndicator, List} from "react-native-paper";
import txTypes from "../constants/TransactionTypes";
import {Text} from "react-native";
import {formatNumber} from "../utils/formatNumber";
import {TypedTransaction} from "../interfaces/TypedTransaction";

export default function TransactionListItem(params: {direction: 'in' | 'out', tx: TypedTransaction}): JSX.Element {
    const {direction, tx} = params

    let description = ''
    if (direction === 'out') {
        if (tx.type === 11) {
            description = `To: ${tx.transfers.length} recipients`
        } else if (tx.recipient) {
            description = 'To: ' + shortAddress(tx.recipient)
        }
    } else {
        description = 'From: ' + shortAddress(tx.sender)
    }

    return (
        <List.Item
            key={`transaction:${tx.id}`}
            style={{ padding: 0}}
            title={txTypes[tx.type].description}
            titleStyle={{ fontSize: 14 }}
            description={description}
            descriptionStyle={{ fontSize: 12, marginBottom: 0 }}
            left={({color, style}) => tx.pending
                ? <ActivityIndicator style={{...style, marginLeft: 8}} animating={true} color="#A017B7" />
                : <List.Icon color={color} style={{...style, marginLeft: 0, marginRight: 8}} icon={txTypes[tx.type].icon[direction]!}/>
            }
            right={({style}) => <Text style={{...style, alignSelf: 'center'}}>{tx.amount ? formatNumber(tx.amount) + ' LTO' : ''}</Text>}
        />
    )
}
