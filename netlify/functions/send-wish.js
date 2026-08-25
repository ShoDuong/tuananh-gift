exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        ok: false,
        error: "Method not allowed"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const cleanWish = String(body.wish || "").trim();
    const cleanName = String(body.name || "Anonymous").trim();

    if (!cleanWish) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: "Wish is empty"
        })
      };
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Discord webhook is not configured"
        })
      };
    }

    const discordPayload = {
      username: "Birthday Wish Mailbox 💌",
      embeds: [
        {
          title: "✨ New Birthday Wish",
          color: 16738740,
          fields: [
            {
              name: "From",
              value: cleanName || "Anonymous",
              inline: true
            },
            {
              name: "Wish",
              value: cleanWish.slice(0, 1000)
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Failed to send wish to Discord"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Server error"
      })
    };
  }
};