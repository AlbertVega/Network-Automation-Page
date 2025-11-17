import discord
from discord.ext import commands
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import threading
import os

load_dotenv()  

TOKEN = os.getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = int(os.getenv("CHANNEL_ID"))

app = Flask(__name__)
app.config["DEBUG"] = True #TEsting nada mas 


intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

app = Flask(__name__)

#   ENDPOINT PARA RECIBIR ALERTAS
@app.post("/send-alert")
@app.post("/send-alert")
def send_alert():
    try:
        print(">>> ALERTA RECIBIDA <<<")
        data = request.json
        message = data.get("message")
        channel = bot.get_channel(CHANNEL_ID)

        if channel is None:
            print("ERROR: canal no encontrado")
            return jsonify({"error": "canal no encontrado"}), 404

        bot.loop.create_task(channel.send(message))

        return jsonify({"ok": True})

    except Exception as e:
        print("EXCEPCIÓN DETECTADA:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------------
#      INICIAR FLASK EN HILO
# -------------------------------
def run_flask():
    app.run(host="0.0.0.0", port=5000)

@bot.event
async def on_ready():
    print(f"Bot conectado como {bot.user}")

# -------------------------------
#  INICIO DEL BOT + SERVIDOR API
# -------------------------------
if __name__ == "__main__":
    threading.Thread(target=run_flask).start()  # Iniciar Flask aparte
    bot.run(TOKEN)
