from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from catboost import CatBoostClassifier
import matplotlib.pyplot as plt
import shap
import pickle
import os

app = Flask(__name__)
cors = CORS(app, origins='*')

with open('shap_explainer.pkl', 'rb') as f:
    explainer = pickle.load(f)


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
        'Yes': 0,
        'Borderline': 0.5,
        'No': 1
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")  

def map_smoker(df, column_name):
    # Define the mapping dictionary
    mapping = {
        'Every Day': 0,
        'Sometimes': 0.5,
        'Never': 1
    }
    
    # Apply the mapping to the specified column
    if column_name in df.columns:
        df[column_name] = df[column_name].map(mapping)
    else:
        print(f"Column {column_name} not found in DataFrame")  

def map_yes_and_no(df, column_names):
    # Define the mapping dictionary
    mapping = {
        'Yes': 0,
        'No': 1
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
    map_gender(df, 'Gender')
    map_diabetes(df, 'Diabetes')
    map_smoker(df, 'Smoker')
    yes_no_columns = ['Cholesterol', 'Stroke', 'ModActivity', 'VigActivity']
    map_yes_and_no(df, yes_no_columns)


def create_new_features(df):
    df['BMI'] = df['Weight'] / ((df['Height'] / 100)**2)
    df['WeightedActivity'] = (1 - df['VigActivity']) * 2 + (1 - df['ModActivity'])
    df['AlcConsump/Yr'] = df['AlcConsumpFreq'] * df['AlcConsumpAmtPerDrinkDay']
    # Must add lifetime cigs and yearsSmoked but need questions more confirmed

def concat_min_max_df(df):
    # Specify the path to your CSV file
    file_path = 'max_min_values.csv'

    # Read the CSV file into a DataFrame
    max_min_df = pd.read_csv(file_path)
    common_columns = df.columns.intersection(max_min_df.columns)

    # Filter DataFrames to only these common columns
    df_filtered = df[common_columns]
    max_min_df_filtered = max_min_df[common_columns]

    # Concatenate the filtered DataFrames
    to_scale_df = pd.concat([df_filtered, max_min_df_filtered], ignore_index=True)

    return to_scale_df

def scale(df):
        # Initialize the MinMaxScaler
    scaler = MinMaxScaler()

    # Fit and transform the DataFrame
    df_scaled = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)
    return df_scaled


def preprocess_data(input_data):
    #Define column names
    column_names = [
        'Age', 'Height', 'Weight', 'Waist', 'Gender',
        'GenHealth', 'OvrDietHealth', 'EducationLvl', 'Smoker',
        'AgeStartSmoking', 'CigsPerDay', 'AgeQuitSmoking', 'AlcConsumpFreq',
        'AlcConsumpAmtPerDrinkDay', 'Diabetes', 'Cholesterol', 'Stroke', 'ModActivity', 'VigActivity'
    ]
    # Convert input data to DataFrame
    df = pd.DataFrame([input_data['answers']], columns=column_names)
   # Assuming df is your DataFrame and it has been defined somewhere in your code
    columns_to_convert = ['Age', 'Height', 'Weight', 'AgeStartSmoking', 'CigsPerDay', 'AgeQuitSmoking', 'AlcConsumpAmtPerDrinkDay']

# Convert each specified column to numeric, handling non-numeric values gracefully
    for column in columns_to_convert:
        df[column] = pd.to_numeric(df[column], errors='coerce').astype(float)

    # Put below in dedicated mapping function
    map(df)
    create_new_features(df)
    # Concatanate max and min values
    to_scale_df = concat_min_max_df(df)
    # Scale
    scaled_df = scale(to_scale_df)
    # Remove final two rows of df_sclaed (min and max)
    scaled_df = scaled_df[:-2]

    #Recombine
    for column in scaled_df.columns:
        if column in df.columns:
            df.at[0, column] = scaled_df.at[0, column]

    # Adding new features and initializing them with 0
    df['yearsSmoked'] = 0
    df['lifetimeCigarettes'] = 0

    df = df[['Gender', 'Age', 'EducationLvl', 'BMI', 'Height', 'Waist', 'Weight',
       'Cholesterol', 'Diabetes', 'AlcConsumpAmtPerDrinkDay', 'OvrDietHealth',
       'GenHealth', 'Stroke', 'yearsSmoked', 'lifetimeCigarettes',
       'AlcConsump/Yr', 'WeightedActivity']]

    return df

def load_model():
    # Create an instance of the model
    model = CatBoostClassifier()

    # Load the model from the file
    model.load_model('model.cbm', format='cbm')
    return model


@app.route('/api/submit_answers', methods=['POST'])
def submit_answers():
    try:
        # Receive data from frontend
        data = request.get_json(force=True)
        # Preprocess data into a DataFrame
        df = preprocess_data(data)  
        # Load the trained model
        model = load_model()
        # Predict probabilities
        pred_prob = model.predict_proba(df)[:, 1]
        print('Prediction:\n', pred_prob)

        # Extract SHAP values for the instance
        instance = df.iloc[[0]]  # Select the first instance from the DataFrame
        shap_values = explainer(instance)  # Compute SHAP values for the instance

        # Convert SHAP values to a dictionary format for JSON
        shap_dict = {
            feature: shap_value
            for feature, shap_value in zip(instance.columns, shap_values.values[0])
        }


        # Return success response including prediction and SHAP values
        return jsonify({'status': 'success', 'data': data, 'prediction': pred_prob.tolist(), 'shap_values': shap_dict})
    except Exception as e:
        print(f"Error during request handling: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400



if __name__ == '__main__':
    app.run(debug=False, port=5000)
