exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" })
    };
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Discord webhook is not configured" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const data = Buffer.from(String(body.data || ""), "base64");
    const filename = String(body.filename || "photobooth.png").replace(/[^a-zA-Z0-9._-]/g, "_");
    const contentType = String(body.contentType || "application/octet-stream");
    if (!data.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Photo data is empty" })
      };
    }

    const boundary = `----OtterBooth${Date.now()}`;
    const prefix = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: ${contentType}\r\n\r\n`
    );
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat([prefix, data, suffix])
    });

    if (!discordResponse.ok) {
      console.error("Discord photo API error:", await discordResponse.text());
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: "Failed to send photo to Discord" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    console.error("Photo upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Server error" })
    };
  }
};
