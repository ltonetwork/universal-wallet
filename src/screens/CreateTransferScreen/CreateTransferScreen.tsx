import React, { useContext, useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import { MessageContext } from '../../context/UserMessage.context'
import {
  Container,
  InputContainer,
  FeeText
} from './CreateTransferScreen.styles'
import {MainTitle} from '../../components/styles/NextFunctionality.styles'
import LTOService from '../../services/LTO.service'
import {HelperText} from 'react-native-paper';
import { StyledInput } from '../../components/styles/StyledInput.styles'
import {LTO_REPRESENTATION} from '../../constants/Quantities'
import {TypedDetails} from '../../interfaces/TypedDetails'
import {formatNumber} from '../../utils/formatNumber'
import {ButtonContainer} from '../SignInScreen/SignInScreen.styles'
import {StyledButton} from '../../components/styles/StyledButton.styles'
import {confirmationMessage} from '../../utils/confirmationMessage'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import {TypedTransaction} from '../../interfaces/TypedTransaction'
import {Transfer as TransferTx} from '@ltonetwork/lto'


export default function CreateTransferScreen({ navigation }: RootStackScreenProps<'CreateTransfer'>) {
  const [accountAddress, setAccountAddress] = useState('')
  const [details, setDetails] = useState<TypedDetails>({} as TypedDetails)

  const [recipient, setRecipient] = useState('')
  const [amountText, setAmountText] = useState('')
  const [amount, setAmount] = useState(0)
  const [attachment, setAttachment] = useState('')

  const [tx, setTx] = useState<TransferTx | undefined>()

  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [dialogVisible, setDialogVisible] = useState(false)

  const { available } = details

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

  return (
    <>
      <Container>
        <OverviewHeader
          marginLeft={-10}
          icon={"close"}
          onPress={() => navigation.goBack()}
          input={<MainTitle>Transfer</MainTitle>} />

        <InputContainer>
          <StyledInput
            label="Recipient"
            value={recipient}
            error={recipient !== '' && !LTOService.isValidAddress(recipient)}
            onChangeText={setRecipient}
          />
          <StyledInput
              label="Amount"
              value={amountText}
              error={isNaN(amount) || amount < 0 || amount > available}
              onChangeText={setAmountText}
              keyboardType="numeric"
          />
          <HelperText type="info">
            Available: { formatNumber(Math.max(available - LTO_REPRESENTATION, 0)) } LTO
          </HelperText>

          <StyledInput
              label="Note (optional)"
              value={attachment}
              error={attachment.length > 100}
              onChangeText={setAttachment}
          />

          <FeeText>Fee: 1 LTO</FeeText>
        </InputContainer>

        <ButtonContainer>
          <StyledButton
              mode='contained'
              color='#A017B7'
              uppercase={false}
              labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
              onPress={() => {
                setTx(new TransferTx(recipient, amount, attachment))
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
          onCancel={() => {
            setTx(undefined)
            setDialogVisible(false)
          }}
      />
    </>
  )
}
