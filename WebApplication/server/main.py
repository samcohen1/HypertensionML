from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
cors = CORS(app, origins='*')


def adjust_health(row, health_feature):
    if row['Age'] < 35:
        return row[health_feature] - 0.5
    elif 60 <= row['Age'] <= 80:
        return row[health_feature] + 0.5
    elif row['Age'] >= 80:
        return row[health_feature] + 1
    else:
        return row[health_feature]

def map_health_ratings(df, column_name):
    mapping = {
        'Excellent': 1,
        'Very Good': 2,
        'Good': 3,
        'Fair': 4,
        'Poor': 5
    }
    
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping).astype(float)  # Ensure it's float for subsequent operations
        df[column_name] = df.apply(lambda row: adjust_health(row, column_name), axis=1)
    else:
        print(f"Column {column_name} not found in DataFrame")

     


def map_alc_consump_freq(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Every Day': 365,
        'Most Days': 300,
        '3-4 times per week': 182,
        '2 times per week': 104,
        'Once a week': 52,
        '2-3 times a month': 30,
        'Once a month': 12,
        '5-10 times': 9,
        'Less than 5 times': 5,
        'Never': 0
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")

def map_education_lvl(df, column_name):
    mapping = {
        'Less than 9th grade': 1,
        'Grades 9-11': 2,
        'High School Graduate': 3,
        'Undergraduate Degree or Diploma': 4,
        'Post Graduate Degree': 5,
        '2-3 times a month': 30
    }

    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")

def map_gender(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Male': 1,
        'Female': 0
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")        

def map_diabetes(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Yes': 1,
        'Borderline': 0.5,
        'No': 0
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")  

def map_smoker(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Every day': 1,
        'Sometimes': 0.5,
        'No': 0
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")  

def map_yes_and_no(df, column_names):
    # Define the mapping dictionary
    mapping = {
        'Yes': 1,
        'No': 0
    }
    
    # Iterate through the list of column names and apply the mapping
    for column_name in column_names:
        if column_name in df.columns:
            df[column_name] = df[column_name].map(mapping)
        else:
            print(f"Column {column_name} not found in DataFrame")

def map(df):
    map_health_ratings(df, 'GenHealth')
    map_health_ratings(df, 'OvrDietHealth')
    map_alc_consump_freq(df, 'AlcConsumpFreq')
    map_education_lvl(df, 'EducationLvl')
    map_gender(df, 'Male')
    map_diabetes(df, 'Diabetes')
    map_smoker(df, 'Smoker')
    yes_no_columns = ['Cholesterol', 'Stroke', 'ModActivity', 'VigActivity']
    map_yes_and_no(df, yes_no_columns)


def create_new_features(df):
    df['BMI'] = df['Weight'] / ((df['Height'] / 100)**2)
    df['WeightedActivity'] = df['VigActivity'] * 2 + df['ModActivity']
    df['AlcConsump/Yr'] = df['AlcConsumpFreq'] * df['AlcConsumpAmtPerDrinkDay']
    # Must add lifetime cigs and yearsSmoked but need questions more confirmed

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
        'AgeStartSmoking', 'Smoker', 'CigsPerDay', 'AgeQuitSmoking', 'AlcConsumpFreq',
        'AlcConsumpAmtPerDrinkDay', 'Diabetes', 'Cholesterol', 'Stroke', 'ModActivity', 'VigActivity'
    ]
    # Convert input data to DataFrame
    df = pd.DataFrame([input_data['answers']], columns=column_names)
   # Assuming df is your DataFrame and it has been defined somewhere in your code
    columns_to_convert = ['Age', 'Height', 'Weight', 'AlcConsumpAmtPerDrinkDay']

# Convert each specified column to numeric, handling non-numeric values gracefully
    for column in columns_to_convert:
        df[column] = pd.to_numeric(df[column], errors='coerce')

    # Put below in dedicated mapping function
    map(df)
    create_new_features(df)
    print(df.head())

    # Call concat and scale functions
    # Remove final two rows of df_sclaed (min and max)
    # df = df[:-2]


    return df

@app.route('/api/submit_answers', methods=['POST'])
def submit_answers():
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
