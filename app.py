from flask import Flask, request, jsonify, render_template
from flask_cors import cross_origin
import json
from sentimentanalysis import output_newquery


app = Flask(__name__)

@app.route("/", methods=["GET"])
def main():
    return render_template("main.html")

@app.route("/extractNotice", methods=["GET"])
def extractNotice():
    return render_template("extractNotice.html")

@app.route("/BulletCharts", methods=["GET"])
def BulletCharts():
    return render_template("BulletCharts/index.html")

@app.route("/RadialBoxplot", methods=["GET"])
def RadialBoxplot():
    return render_template("RadialBoxplot/index.html")

@app.route("/ClusterDendrogram", methods=["GET"])
def ClusterDendrogram():
    return render_template("ClusterDendrogram/index.html")

# @app.route('/api/model', methods=["POST"])
@app.route('/api/model', methods=["POST"])
@cross_origin()
def model():
    try:
        input_body = request.form.get('body','')
        result = output_newquery(input_body)

        # model = output_newquery(input_body)
        # result = output_newquery("")

        return jsonify(result)

    except Exception as e:
        print(str(e))
        return jsonify({"code": -1, "data": str(e)})

@app.route('/api/getmodel', methods=["GET"])
@cross_origin()
def getmodel():
    try:
        input_body = request.form.get('body','')
        result = output_newquery(input_body)
        return jsonify(result)

    except Exception as e:
        print(str(e))
        return jsonify({"code": -1, "data": str(e)})

if __name__ == '__main__':
    app.run()

application = app