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
    const cleanName = String(body.name || "Tuấn Anh / Người gửi").trim();
    const cleanMood = String(body.tiramisuMood || "classic").trim();

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
      avatar_url: "https://cdn-icons-png.flaticon.com/512/3159/3159420.png",
      embeds: [
        {
          title: "✨ Lời Ước Sinh Nhật Mới!",
          color: 16738740,
          fields: [
            {
              name: "👤 Tới / Người chọn",
              value: cleanName,
              inline: true
            },
            {
              name: "🍰 Tiramisù Mood",
              value: cleanMood.toUpperCase(),
              inline: true
            },
            {
              name: "💌 Điều ước",
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
      const errorText = await discordResponse.text();
      console.error("Discord API Error:", errorText);
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
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Server error"
      })
    };
  }
};