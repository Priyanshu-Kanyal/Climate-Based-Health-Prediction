import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
import statsmodels.formula.api as smf
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import shap
import joblib
import os

def main():
    print("Starting ML Model Training...")
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    data_path = os.path.join(root_dir, 'ML_training_dataset_comprehensive.csv')
    
    graphs_dir = os.path.join(root_dir, 'backend', 'public', 'graphs')
    os.makedirs(graphs_dir, exist_ok=True)
    
    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    # Filter for 'Total' to avoid double-counting Public/Private splits
    df = df[df['Demographic'] == 'Total'].copy()

    # Define disease targets
    df['Dengue_Cases'] = df[['M11 [NVBDCP] | Dengue - Enzyme- Linked Immuno Sorbent Assay (ELISA) Test Positive (TOTAL)', 
                             'M11 [NVBDCP] | Dengue - RDT Test Positive (TOTAL)', 
                             'M14 [Patient Services] | Inpatient - Dengue (TOTAL)']].sum(axis=1)
                             
    df['Malaria_Cases'] = df[['M11 [NVBDCP] | Malaria (Microscopy Tests ) - Plasmodium Falciparum test positive (TOTAL)', 
                              'M11 [NVBDCP] | Malaria (Microscopy Tests ) - Plasmodium Vivax test positive (TOTAL)', 
                              'M11 [NVBDCP] | Malaria (RDT) - Plamodium Falciparum test positive (TOTAL)', 
                              'M11 [NVBDCP] | Malaria (RDT) - Plasmodium Vivax test positive (TOTAL)', 
                              'M14 [Patient Services] | Inpatient - Malaria (TOTAL)']].sum(axis=1)
                              
    df['Diarrhea_Cases'] = df[['M10 [Number of cases of Childhood Diseases (0-5 years)] | Childhood Diseases - Diarrhoea (TOTAL)', 
                               'M14 [Patient Services] | Inpatient - Diarrhea with dehydration (TOTAL)']].sum(axis=1)
                               
    df['Typhoid_Cases'] = df['M14 [Patient Services] | Inpatient - Typhoid (TOTAL)'].fillna(0)

    df['Respiratory_Cases'] = df[['M10 [Number of cases of Childhood Diseases (0-5 years)] | Childhood Diseases - Asthma (TOTAL)', 
                                  'M10 [Number of cases of Childhood Diseases (0-5 years)] | Childhood Diseases - Pneumonia (TOTAL)', 
                                  'M10 [Number of cases of Childhood Diseases (0-5 years)] | Children admitted with upper respiratory infections (TOTAL)', 
                                  'M14 [Patient Services] | Inpatient - Asthma, Chronic Obstructive Pulmonary Disease (COPD), Respiratory infections (TOTAL)']].sum(axis=1)

    disease_cols = ['Dengue_Cases', 'Malaria_Cases', 'Diarrhea_Cases', 'Typhoid_Cases', 'Respiratory_Cases']
    weather_cols = [c for c in df.columns if 'Weather' in c]
    
    print("Calculating correlations and generating heatmap...")
    corr_df = df[disease_cols + weather_cols].corr()

    plt.figure(figsize=(12, 8))
    cleaned_weather_cols = [c.split(' | ')[1].replace(' (Weather Data)', '') for c in weather_cols]
    heatmap_data = corr_df.loc[weather_cols, disease_cols]
    heatmap_data.index = cleaned_weather_cols

    sns.heatmap(heatmap_data, annot=True, cmap='coolwarm', fmt=".2f", center=0)
    plt.title('Correlation between Weather Variables and Disease Cases', fontsize=14)
    plt.ylabel('Weather Variables', fontsize=12)
    plt.xlabel('Disease Cases', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    heatmap_path = os.path.join(graphs_dir, 'correlation_heatmap.png')
    plt.savefig(heatmap_path)
    plt.close()
    print(f"--> Saved '{heatmap_path}'")

    print("\nPreparing temporal data for Epidemiological Models...")
    month_map = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    df['Month_Num'] = df['Month'].map(month_map)
    df = df.sort_values(by=['District', 'Year', 'Month_Num']).reset_index(drop=True)

    weather_rename_map = {
        'Weather | Avg Temperature_Average (Weather Data)': 'Temp_Avg',
        'Weather | Dew Point_Average (Weather Data)': 'Dew_Avg',
        'Weather | Precipitation_Sum (Weather Data)': 'Precip_Sum'
    }
    df = df.rename(columns=weather_rename_map)

    # Lags
    lag_cols = ['Temp_Avg', 'Dew_Avg', 'Precip_Sum']
    for col in lag_cols:
        df[f'Lag1_{col}'] = df.groupby('District')[col].shift(1)

    model_df = df.dropna(subset=[f'Lag1_{col}' for col in lag_cols] + disease_cols).copy()

    features = ['Lag1_Temp_Avg', 'Lag1_Dew_Avg', 'Lag1_Precip_Sum']
    
    print("\nTraining models and evaluating...")
    for disease in disease_cols:
        print(f"\nTraining XGBoost for: {disease}...")
        model_data = model_df.dropna(subset=features + [disease])
        X = model_data[features]
        y = model_data[disease]
        
        xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
        xgb_model.fit(X, y)
        
        # Save model
        model_out_path = os.path.join(script_dir, f'xgboost_{disease}.joblib')
        joblib.dump(xgb_model, model_out_path)
        print(f"--> Saved model to {model_out_path}")
        
        if disease == 'Respiratory_Cases': # specific one to plot feature importances
            importances = xgb_model.feature_importances_
            plt.figure(figsize=(8, 5))
            sns.barplot(x=importances, y=features, palette='viridis')
            plt.title(f'XGBoost Feature Importance for {disease}', fontsize=14)
            plt.xlabel('Relative Importance')
            plt.ylabel('Weather Features')
            plt.tight_layout()
            feat_imp_path = os.path.join(graphs_dir, 'xgboost_feature_importance.png')
            plt.savefig(feat_imp_path)
            plt.close()
            print(f"--> Saved '{feat_imp_path}'")
            
            # Save SHAP plots for Respiratory Cases as well, to be robust
            print(f"Running SHAP Analysis for {disease}...")
            explainer = shap.TreeExplainer(xgb_model)
            shap_values = explainer.shap_values(X)
            
            plt.figure(figsize=(10, 6))
            plt.title(f"SHAP Summary: How Weather Drives {disease}", fontsize=14)
            shap.summary_plot(shap_values, X, show=False)
            plt.tight_layout()
            shap_summary_path = os.path.join(graphs_dir, 'shap_summary.png')
            plt.savefig(shap_summary_path)
            plt.close()
            print(f"--> Saved '{shap_summary_path}'")

    print("\nAll models trained and artifacts saved!")

if __name__ == '__main__':
    main()
