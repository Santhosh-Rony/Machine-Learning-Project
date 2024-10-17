import pickle
import json
import numpy as np
import os
import logging
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='sklearn')

__locations = None
__data_columns = None
__model = None

# Set up logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    # Create an input array for the model with default zeros
    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    if loc_index >= 0:
        x[loc_index] = 1

    # Return the predicted price, rounded to 2 decimal places
    return round(__model.predict([x])[0], 2)

def load_saved_artifacts():
    global __data_columns
    global __locations
    global __model

    logging.info("Loading saved artifacts...")

    try:
        # Load column names from JSON file
        with open(os.path.join('artifacts', 'columns.json'), 'r') as f:
            __data_columns = json.load(f)['data_columns']
            __locations = __data_columns[3:]  # first 3 columns are sqft, bath, bhk

        # Load the model from pickle
        with open(os.path.join('artifacts', 'banglore_home_price_model.pickle'), 'rb') as f:
            __model = pickle.load(f)

        logging.info("Artifacts loaded successfully.")
    except Exception as e:
        logging.error(f"Error loading artifacts: {e}")

def get_location_names():
    return __locations

def get_data_columns():
    return __data_columns

if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print(get_estimated_price('Kalhalli', 1000, 2, 2))  # other location
    print(get_estimated_price('Ejipura', 1000, 2, 2))  # other location
