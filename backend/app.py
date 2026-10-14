# import the Flask class and request object from the flask module
from flask import Flask,request,jsonify

from business import getNames,saveNames,read_data
#create the instance of the flask app
app=Flask(__name__)

@app.route('/',methods=['GET'])
def home():
    return jsonify({"message":"Hello World!"})

@app.route('/api',methods=['GET'])
def getdata():
    data = getNames()
    data = {'data':data}
    return jsonify(data)

#save to the file
@app.route('/submit' , methods=['POST'])
def signup():
    # Since Express sent 'application/json', use request.get_json()
    data = request.get_json()
    print("Received data from Express:", data)
    form_data = dict(data)  # Convert ImmutableMultiDict to a regular dictionary    
    saveNames(form_data)    
    # return ('Data Saved Successfully')
    return jsonify({"status": "success", "message": "Data Saved successfully!"}), 200


#read from file
@app.route('/viewdata')
def viewdata():
    #Read the content of the file
    file_content = read_data()    
    return file_content


if __name__=="__main__":
    app.run(debug=True,port=5000,host='0.0.0.0')