import json
import sys
import uuid
from dateutil import parser
from xrp import finishEscrowDict
from xrp import usdToXrp
from xrp import createEscrow, finishEscrow
from flask import Flask, request, jsonify
import openai
import fitz
from dotenv import load_dotenv
import os

load_dotenv()

from flask_cors import CORS

### Keyed by the id of the xrp escrow, references the mappings from the pdf
# Contains "alias": {components: {}, txn_data: {}, fulfilled: false, finished: false}
MAPPINGS = {}

# print(search.execute())
app = Flask(__name__)
app.config["SERVER_NAME"] = "localhost:8000"
CORS(app, origins=["http://localhost:3000", "http://localhost:3000/*", "*"])

openai.api_key = os.getenv("OPENAI_API_KEY")
def getComponents(text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are escrowGPT. Users give you the text from their escrow agreements"
                + "and you identify the following: The name of the sender, the name of the reciever, the name of the third party verifier, a sentence summarizing the condition to be met,"
                + "the usd amount in escrow as a float with two decimals, and the expiration date of the contract as an ISO datetime."
                + 'Your answers match this format exactly: {"sender": "...", "reciever": "...", "thirdParty":"...", "amount": "...", "condition": "...", "expiration": "..."}',
            },
            {
                "role": "user",
                "content": text,
            },
        ],
    )
    print("\n\n\n\n\n\n\n\n This is Response Message")
    print(response)
    return response["choices"][0]["message"]["content"]


def extract_text_from_pdf(pdf):
    # Open the PDF
    pdf_document = fitz.open("pdf", pdf.read())
    text = ""

    # Iterate through the pages and extract text
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")

    return text


@app.route("/derive", methods=["GET", "POST"])
def hello_world():
    print(request.files)
    file = request.files.get("files")
    print(file)
    extracted_text = extract_text_from_pdf(file)
    print(extracted_text)
    # components = getComponents(extracted_text)
    # components = json.loads(components)
    # print(components)
    response_components = {
        "amount":"1000.00",
        "condition": "Successful completion of the construction and delivery of a table made out of cherry wood",
        "expiration": "2023-04-01T12:00:00",
        "reciever": "Kyle Bond",
        "sender": "Ethan Bond",
        "thirdParty": "Keanu Reeves"
    }
    return jsonify({"components": response_components})


@app.route("/escrow", methods=["POST"])
def escrow():

    # json format
    # { seed, sequence, xaddress, condition }
    data = request.get_json()
    components = data.get("components")
    
    seed = data.get("seed")
    sequence = data.get("sequence")
    rec_addr = data.get("rec_addr")

    amount = float(components.get("amount")) / usdToXrp()

    expiration = parser.parse(components.get("expiration"))
    ### print("helloooo", file=sys.stdout)
    ### print(type(expiration))
    ### print(expiration)
    txn_data = createEscrow(seed, sequence, rec_addr, amount, expiration)

    uid = str(uuid.uuid4())
    metadata = {
        "components": components,
        "txn_data": txn_data,
        "fulfilled": False,
        "finished": False,
    }

    MAPPINGS[uid] = metadata

    print("\n\nMAPPINGS>>>>>>>>>>>> : ", MAPPINGS)
    print("\n\n<<<<<<<<<<<<<id", uid)

    return jsonify({"metadata": metadata, "id": uid})


@app.route("/validate/<txnId>", methods=["GET"])
def validate(txnId):

    if txnId in MAPPINGS:
        txn = MAPPINGS.get(txnId)
        txn["fulfilled"] = True
        return jsonify({"success": True})

    return jsonify({"success": False})


@app.route("/reference/<uid>", methods=["GET"])
def reference(uid):
    print("MAPPINGS>>>>>>>>>>>> : ", MAPPINGS);
    return jsonify({"reference": MAPPINGS.get(uid)})


@app.route("/finish/<uid>", methods=["GET"])
def finish(uid):

    if (
        uid in MAPPINGS
        and MAPPINGS.get(uid).get("fulfilled")
        and not MAPPINGS.get(uid).get("finished")
    ):
        mapping = MAPPINGS.get(uid)
        finishEscrowDict(mapping.get("txn_data"))
        mapping["finished"] = True
        MAPPINGS[uid] = mapping
        return jsonify({"success": True})
    return jsonify({"success": False})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8000")
