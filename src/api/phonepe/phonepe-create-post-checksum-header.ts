
import sha256 from "crypto-js/sha256";
export function createPostCheckSumHeader(
    payload: any,
    salt?: string,
    apiString?: string
) {
    const SALT_KEY = salt ?? "test-salt";
    const payloadWithSalt = payload + `${apiString ?? ""}${SALT_KEY}`;
    const encodedPayload = sha256(payloadWithSalt).toString();
    const checksum = `${encodedPayload}###1`;
    return { checksum, encodedBody: payload };
}