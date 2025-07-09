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

  static async decodeJwt(
    jwt: string,
    secret: string
  ): Promise<Record<string, unknown>> {
    const [header, payload, signature] = jwt.split(".");
    const data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const expectedSignature = await JWTHelpers.buildSignature(
      `${header}.${payload}`,
      secret
    );
    if (expectedSignature !== signature) {
      throw new Error("Invalid JWT signature");
    }
    return data;
  }
}
