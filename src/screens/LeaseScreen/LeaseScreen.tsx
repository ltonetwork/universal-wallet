import React, { useContext, useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import { MessageContext } from '../../context/UserMessage.context'
import {
  Container,
  InputContainer,
  FeeText
} from './LeaseScreen.styles'
import {MainTitle} from '../../components/styles/NextFunctionality.styles'
import LTOService from '../../services/LTO.service'
import {HelperText, List, TextInput} from 'react-native-paper'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import {LTO_REPRESENTATION} from '../../constants/Quantities'
import {TypedDetails} from '../../interfaces/TypedDetails'
import {formatNumber} from '../../utils/formatNumber'
import {ButtonContainer} from '../SignInScreen/SignInScreen.styles'
import {StyledButton} from '../../components/styles/StyledButton.styles'
import {confirmationMessage} from '../../utils/confirmationMessage'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import {TypedTransaction} from '../../interfaces/TypedTransaction'
import {Lease as LeaseTx} from '@ltonetwork/lto'
import {TypedCommunityNode} from '../../interfaces/TypedCommunityNode'
import CommunityNodesService from '../../services/CommunityNodes.service'
import {shuffleArray} from '../../utils/shuffleArray'
import {FlatList} from 'react-native'


export default function LeaseScreen({ navigation, route }: RootStackScreenProps<'Lease'>) {
  const [accountAddress, setAccountAddress] = useState('')
  const [details, setDetails] = useState<TypedDetails>({} as TypedDetails)

  const [nodes, setNodes] = useState<TypedCommunityNode[]>([])
  const [selectNode, setSelectNode] = useState(CommunityNodesService.isConfigured)

  const [recipient, setRecipient] = useState('')
  const [recipientNode, setRecipientNode] = useState<TypedCommunityNode|undefined>(undefined)
  const [amountText, setAmountText] = useState('')
  const [amount, setAmount] = useState(0)

  const [tx, setTx] = useState<LeaseTx | undefined>()

  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [dialogVisible, setDialogVisible] = useState(false)

  const { available } = details
  const fee = LTO_REPRESENTATION

  useEffect(() => {
    getAccountAddress()
  }, [])

  const getAccountAddress = () => {
    LTOService.getAccount()
      .then(account => setAccountAddress(account.address))
      .catch(error => {
        throw new Error(`Error retrieving data. ${error}`)
      })
  }

  useEffect(() => {
    loadAccountDetails()
  }, [accountAddress])

  const loadAccountDetails = async () => {
    if (accountAddress === '') {
      setDetails({} as TypedDetails);
      return
    }

    return LTOService.getBalance(accountAddress)
        .then(accountDetails => setDetails(accountDetails))
        .catch(error => { throw new Error(`Error retrieving account data. ${error}`) })
  }

  useEffect(() => {
    CommunityNodesService.list()
        .then(shuffleArray)
        .then(nodes => setNodes(nodes))
  }, [])

  useEffect(() => {
    CommunityNodesService.info(recipient)
        .then(setRecipientNode)
  }, [recipient])

  const renderNode = (node: TypedCommunityNode) => {
    return <List.Item
        title={node.name}
        titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
        description={node.address}
        descriptionStyle={{ fontSize: 12, marginBottom: 0 }}
        onPress={() => {
          setRecipient(node.address)
          setSelectNode(false)
        }}
    />
  }

  useEffect(() => {
    if (amountText === '') {
      setAmount(0)
    } else if (!amountText.match(/^\d+(\.\d+)?$/)) {
      setAmount(NaN)
    } else {
      setAmount(Math.floor(parseFloat(amountText) * LTO_REPRESENTATION))
    }
  }, [amountText])

  const sendTx = async () => {
    const account = await LTOService.getAccount()
    await LTOService.broadcast(tx!.signWith(account))

    setMessageInfo('Transaction sent successfully!')
    setShowMessage(true)

    navigation.goBack()
  }

  return selectNode ? (
    <>
      <Container>
        <OverviewHeader
            marginLeft={-10}
            icon={"close"}
            onPress={() => navigation.goBack()}
            input={<MainTitle>Lease</MainTitle>} />

        <FlatList
            style={{marginLeft: 24, marginRight: 24}}
            data={nodes}
            renderItem={({ item }) => renderNode(item)}
            ListHeaderComponent={
              <List.Item
                  title="Custom"
                  titleStyle={{fontWeight: 'bold'}}
                  description="Lease to an unlisted node by entering the address"
                  onPress={() => {
                    setRecipient('')
                    setSelectNode(false)
                  }}
              />
            }
        />
      </Container>
    </>
  ) : (
    <>
      <Container>
        <OverviewHeader
          marginLeft={-10}
          icon={"close"}
          onPress={() => navigation.goBack()}
          input={<MainTitle>Lease</MainTitle>} />

        <InputContainer>
          <StyledInput
            label="Address"
            value={recipient}
            error={recipient !== '' && !LTOService.isValidAddress(recipient)}
            onChangeText={setRecipient}
            right={<TextInput.Icon
                name="format-list-bulleted"
                color='#673ab7'
                onPress={() => setSelectNode(true)}
            />}
          />
          <HelperText type="info">
            {recipientNode?.name}
          </HelperText>

          <StyledInput
              label="Amount"
              value={amountText}
              error={isNaN(amount) || amount < 0 || amount + fee > available}
              onChangeText={setAmountText}
              keyboardType="numeric"
              right={<TextInput.Icon
                  name="arrow-up-bold-circle-outline"
                  color='#673ab7'
                  onPress={() => setAmountText(((available - 2 * fee) / LTO_REPRESENTATION).toString())}
              />}
          />
          <HelperText type="info">
            Available: { formatNumber(Math.max(available - fee, 0)) } LTO
          </HelperText>

          <FeeText>Fee: 1 LTO</FeeText>
        </InputContainer>

        <ButtonContainer>
          <StyledButton
              mode='contained'
              color='#A017B7'
              uppercase={false}
              labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
              onPress={() => {
                setTx(new LeaseTx(recipient, amount))
                setDialogVisible(true)
              }}
              disabled={(isNaN(amount) || amount <= 0 || amount > available) || (recipient === '' || !LTOService.isValidAddress(recipient))}
          >
            Send
          </StyledButton>
        </ButtonContainer>
      </Container>
      <ConfirmationDialog
          visible={dialogVisible}
          message={tx ? confirmationMessage(tx.toJSON() as TypedTransaction) : ''}
          onPress={sendTx}
          cancelPress={() => {
            setTx(undefined)
            setDialogVisible(false)
          }}
      />
    </>
  )
}
