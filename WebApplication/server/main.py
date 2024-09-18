from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
cors = CORS(app, origins='*')

def map_health_ratings(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Excellent': 1,
        'Very Good': 2,
        'Good': 3,
        'Fair': 4,
        'Poor': 5
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")
    
    return df

def map_alc_consump_freq(df, column_name):
    # Define the mapping dictionary
    mapping = {
        1: 365,
        2: 300,
        3: 182,
        4: 104,
        5: 52,
        6: 30,
        7: 12,
        8: 9,
        9: 5,
        10: 2
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")
    
    return df

def concat_min_max_df(min_max_df, df):
    common_columns = df.columns.intersection(min_max_df.columns)
    min_max_df_filtered = min_max_df[common_columns]
    # Assumes within min max range
    df = pd.concat(df, min_max_df_filtered, ignore_index=True)

def scale(df):
        # Initialize the MinMaxScaler
    scaler = MinMaxScaler()

    # Fit and transform the DataFrame
    df_scaled = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)
    return df_scaled


def preprocess_data(input_data):
    #Define column names
    column_names = [
        'Age', 'Height', 'Weight', 'Waist', 'Male',
        'GenHealth', 'OvrDietHealth', 'EducationLvl', 'EverSmoked',
        'AgeStartSmoking', 'Smoker', 'CigsPerDay', 'AgeQuitSmoking', 'AlcConsump',
        'AlcConsumpAmtPerDrinkDay', 'Diabetes', 'Cholesterol', 'Stroke', 'ModActivity', 'VigActivity'
    ]
    # Convert input data to DataFrame
    df = pd.DataFrame([input_data['answers']], columns=column_names)

    # Put below in dedicated mapping function
    df = map_health_ratings(df, 'GenHealth')
    df = map_health_ratings(df, 'OvrDietHealth')

    # Call concat and scale functions
    # Remove final two rows of df_sclaed (min and max)
    # df = df[:-2]


    return df

@app.route('/api/submit_answers', methods=['POST'])
def submit_answers():
    print('here')
    try:
        data = request.get_json(force=True)
        df = preprocess_data(data)  # Convert received data to DataFrame
        print(df.head())
        #print(df)  # For debugging purposes, prints DataFrame to console
        return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
