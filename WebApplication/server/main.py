from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
cors = CORS(app, origins='*')

def map_ratings(df, column_name):
    # Define the mapping dictionary
    health_mapping = {
        'Excellent': 1,
        'Very Good': 2,
        'Good': 3,
        'Fair': 4,
        'Poor': 5
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(health_mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")
    
    return df

def preprocess_data(input_data):
    #Define column names
    column_names = [
        'Age', 'Height', 'Weight', 'Waist', 'Male',
        'GenHealth', 'OvrDietHealth', 'EducationLvl', 'EverSmoked',
        'AgeStartSmoking', 'Smoker', 'CigsPerDay', 'AgeQuitSmoking', 'AlcConsump',
        'ALcConsumpAmtPerDrinkDay', 'Diabetes', 'Cholesterol', 'Stroke', 'ModActivity', 
    ]
    # Convert input data to DataFrame
    print("Hello\n")
    df = pd.DataFrame([input_data['answers']], columns=column_names)
    # df = map_ratings(df, 'GenHealth')
    # df = map_ratings(df, 'OvrDietHealth')
    print('New DF\n')
    print(df.head())
    # You can add more preprocessing steps here if needed
    return df

@app.route('/api/submit_answers', methods=['POST'])
def submit_answers():
    try:
        data = request.get_json(force=True)
        df = preprocess_data(data)  # Convert received data to DataFrame
        #print(df)  # For debugging purposes, prints DataFrame to console
        return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
