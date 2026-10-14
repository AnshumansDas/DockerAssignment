from flask import Flask,request,jsonify
import json
import os
filename = "mydata.txt"

def getNames():    
    file_content = read_data()
    nameslist = file_content.get("data", [])
    print(nameslist)
    # files.close()
    return nameslist
    
def saveNames(form_data):
    json_data = read_data()
    # Get existing data array
    items = json_data.get("data", [])
    # Check current item length
    current_length = len(items)
    # append to the item list
    items.append(form_data)
    # Update JSON object
    json_data["data"] = items
    # Write back to file
    save_data(json_data)
    #Read the content of the file
    file_content = read_data()


def read_data():
    if not os.path.exists(filename):
        return {"data": []}
    try:
        files = open(filename,"r") #Open the file in read and write mode
        return json.load(files)

    except (json.JSONDecodeError, OSError):
        return {"data": []}

def save_data(data):    
    files = open(filename,"w") #Open the file in write mode
    json.dump(data, files, indent=4)
