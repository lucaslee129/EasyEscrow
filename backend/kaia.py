from web3 import Web3
import json
from dotenv import load_dotenv
import os
from eth_account import Account
from mnemonic import Mnemonic
from bip32 import BIP32

load_dotenv()

# Connect to an Ethereum node (replace with your own node URL)
w3 = Web3(Web3.HTTPProvider('https://rpc.ankr.com/klaytn_testnet'))

# Contract ABI and address
contract_address = '0x82e6d5ec549cd0f815764c09aa0bb64f8947573d'
checksum_address = w3.to_checksum_address(contract_address)


# Load the Abi from the easyEscromAbi.json
def load_abi(filename):  
    with open(filename, 'r') as file:  
        abi = json.load(file)  
    return abi  

abi_file_path = os.path.join(os.path.dirname(__file__), 'easyEscrowAbi.json')  

def mnemonic_to_private_key(mnemonic, account_path="m/44'/60'/0'/0/0"):
    mnemo = Mnemonic("english")
    if not mnemo.check(mnemonic):
        raise ValueError("Invalid mnemonic phrase")
    seed = mnemo.to_seed(mnemonic)
    bip32 = BIP32.from_seed(seed)
    private_key = bip32.get_privkey_from_path("m/44'/60'/0'/0/0").hex()
    print("Private Key is: ", private_key)
    return private_key

contract_address = '0x82e6d5ec549cd0f815764c09aa0bb64f8947573d'
checksum_address = w3.to_checksum_address(contract_address)
contract_abi = load_abi(abi_file_path)

# Create contract instance
contract = w3.eth.contract(address=checksum_address, abi=contract_abi)

# Example function to create a job
def create_escrow_kaia(uuid, sender, validator, amount, recipient,  finishAfter, condition):
    nonce = w3.eth.get_transaction_count(sender)
    txn = contract.functions.createEscrow(uuid, sender, validator, amount, recipient, finishAfter, condition).build_transaction({
        'from' : sender,
        'value' : amount,
        'nonce' : nonce,
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key = os.getenv("SENDER_PRIVATE_KEY"))
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt



def finish_escrow_kaia(uuid, recipientAddress, recipientPrivateKey):
    nonce = w3.eth.get_transaction_count(recipientAddress)
    txn = contract.functions.finishEscrow(uuid).build_transaction({
        'from' : recipientAddress,
        'nonce' : nonce,
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key = recipientPrivateKey)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def releaseFund_kaia(uuid, senderAddress, senderPrivateKey):
    nonce = w3.eth.get_transaction_count(senderAddress)
    txn = contract.functions.releaseFund(uuid).build_transaction({
        'from' : senderAddress,
        'nonce' : nonce,
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key = senderPrivateKey)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt


def validate_escrow_kaia(uuid, validatorAddress, validatorPrivateKey, fundRelease):
    nonce = w3.eth.get_transaction_count(validatorAddress)
    txn = contract.functions.validateEscrow(uuid, fundRelease).build_transaction({
        'from' : validatorAddress,
        'nonce' : nonce,
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key = validatorPrivateKey)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def get_escrow_kaia(uuid):
    escrow_details = contract.functions.getEscrow(uuid).call()
    return {
        "sender": escrow_details[0],
        "recipient": escrow_details[1],
        "amount": escrow_details[2],
        "finishAfter": escrow_details[3],
        "condition": escrow_details[4],
        "finished": escrow_details[5],
        "closed": escrow_details[6]
    }

def get_accept_status_kaia(uuid):
    accept_status = contract.functions.getAcceptStatus(uuid).call()
    return {
        "AcceptedCounter": accept_status[0],
        "RecipientAccepted": accept_status[1],
        "SenderAccepted": accept_status[2],
    }

def test_functions():
    uuid = 1231112333211
    sender = "0x1f7A80A2E08e5EC1675b68f2722D944D0cFeC637"
    validator = "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3"
    amount = w3.to_wei(1, 'ether')
    recipient = "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3"
    finishAfter = 1729144871 + 600
    condition = w3.keccak(text="condition")

    # tx_receipt = create_escrow_kaia(uuid, sender, validator, amount, recipient, finishAfter, condition)
    # print("Escrow created. Transaction hash: {tx_receipt['transactionHash'].hex()}")

    recipient_private_key = mnemonic_to_private_key(os.getenv("RECEIVER_MNEMONIC"))

    # finish_escrow_kaia(uuid, "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3", recipient_private_key)
    # releaseFund (uuid, "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3", recipient_private_key)
    
    validate_escrow_kaia(uuid, "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3", recipient_private_key, False)
    
    escrow_details = get_escrow_kaia(uuid)
    print(f"Escrow details: {escrow_details}")
    acceptedStatus = get_accept_status_kaia(uuid)
    print("\nacceptedStatus: ", acceptedStatus)

test_functions()