import { Buffer } from "buffer";
import { pki } from "node-forge";

export const decodeBase64 = (content: string) => {
	if (content === "") {
		return "";
	}
	const decoded = Buffer.from(
		content,
		"base64",
	).toString();
	return decoded;
};

export const convertRSAPublicKey = (
	pkcs1Pem: string,
) => {
	const pkcs1PrivateKey =
		pki.privateKeyFromPem(pkcs1Pem);

	const asn1 = pki.privateKeyToAsn1(
		pkcs1PrivateKey,
	);
	const pkcs8PrivateKeyInfo =
		pki.wrapRsaPrivateKey(asn1);

	const pkcs8Pem = pki.privateKeyInfoToPem(
		pkcs8PrivateKeyInfo,
	);
	return pkcs8Pem;
};
