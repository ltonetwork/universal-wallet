const factory = require('@ltonetwork/lto').AccountFactoryED25519;

const privateKey = process.env.PRIVATE_KEY

let account = new factory('T').createFromPrivateKey(privateKey);
console.log(account)



// import Account from "./Account";

// export default abstract class AccountFactory {
// 	public readonly chainId: string;

// 	protected constructor(chainId: string){
// 		this.chainId = chainId;
// 	}

//     abstract createFromPublicKey(publicKey: string): Account;

//     abstract createFromPrivateKey(privateKey: string): Account;

//     abstract createFromSeed(seed: string, nonce: number): Account;

//     abstract create(): Account;
// }