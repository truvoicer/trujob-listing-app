export class JWTHelpers {
  static DEFAULT_ALGORITHM = { name: "HMAC", hash: "SHA-256" };

  static DEFAULT_HEADER = {
    alg: "HS256",
    typ: "JWT",
  };

  static base64url(source: string) {
    let encodedSource;
    // Encode in classical base64
    encodedSource = btoa(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, "");

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, "-");
    encodedSource = encodedSource.replace(/\//g, "_");

    return encodedSource;
  }

  static base64urlDecode(encodedSource: string) {
    // Replace characters according to base64url specifications
    let decodedSource = encodedSource.replace(/-/g, "+");
    decodedSource = decodedSource.replace(/_/g, "/");

    // Add padding equal characters if missing
    while (decodedSource.length % 4) {
      decodedSource += "=";
    }

    // Decode in classical base64
    return atob(decodedSource);
  }

  static getDataString(data: Record<string, unknown> | string) {
    return JSON.stringify(data);
  }

  static getEncodedData(dataString: string) {
    return JWTHelpers.base64url(dataString);
  }

  static buildJwt(encodedHeader: string, encodedData: string) {
    return `${encodedHeader}.${encodedData}`;
  }

  static async buildSignature(token: string, secret: string) {
    const signature = await JWTHelpers.HmacSHA256(token, secret);
    return JWTHelpers.base64url(signature);
  }

  static async HmacSHA256(payload: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      JWTHelpers.DEFAULT_ALGORITHM,
      false,
      ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
      JWTHelpers.DEFAULT_ALGORITHM.name,
      key,
      enc.encode(payload)
    );

    // convert buffer to byte array
    const hashArray = Array.from(new Uint8Array(signature));

    // convert bytes to hex string
    const digest = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return digest;
  }
  static async getSignedJwt({
    secret,
    payload,
    headerData = JWTHelpers.DEFAULT_HEADER,
  }: {
    secret: string;
    payload: Record<string, unknown>;
    headerData?: Record<string, unknown>;
  }) {
    const headerString = JWTHelpers.getDataString(headerData);
    const encodedHeader = JWTHelpers.getEncodedData(headerString);
    const payloadString = JWTHelpers.getDataString(payload);
    const encodedPayload = JWTHelpers.getEncodedData(payloadString);
    const token = JWTHelpers.buildJwt(encodedHeader, encodedPayload);
    const signature = await JWTHelpers.buildSignature(token, secret);
    return `${token}.${signature}`;
  }

  /**
   * Decodes a JWT token.
   * @param token The JWT token string.
   * @returns An object containing the decoded header, payload, and signature.
   * @throws {Error} If the token format is invalid or decoding fails.
   */
  static decodeJwt(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format. Expected 3 parts: header.payload.signature');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    try {
      const decodedHeaderString = JWTHelpers.base64urlDecode(encodedHeader);
      const header = JSON.parse(decodedHeaderString);

      const decodedPayloadString = JWTHelpers.base64urlDecode(encodedPayload);
      const payload = JSON.parse(decodedPayloadString);

      return {
        header,
        payload,
        signature
      };
    } catch (error) {
      console.error("Error decoding JWT:", error);
      throw new Error("Failed to decode JWT token. Check if it's a valid base64url encoded string or valid JSON.");
    }
  }
}