# 🎓 How to Train Your AI Detector on Google Colab

Here are the two best ways to run your training in the cloud.

---

## 🚀 Option 1: GitHub (Recommended)
**Best for:** Easy updates, reproducibility, and clean setup.  
**Note:** Since `Human.csv` is 2GB, it is NOT in GitHub. You must put that *one file* in your Google Drive.

### 1. Run this in a Colab Cell:
```python
# 1. Clone your code
!git clone https://github.com/Benwil1/Student_detector.git

# 2. Go into the folder
%cd Student_detector

# 3. Mount Drive (to access your big Human.csv dataset)
from google.colab import drive
drive.mount('/content/drive')

# 4. Link the Big Dataset
# (Make sure Human.csv is in your Drive at this path!)
!ln -sf "/content/drive/MyDrive/Human.csv" "Human_text/Human.csv"

# 5. Run the Training Script
!python3 scripts/train_super_detector.py
```

### 2. Save your trained model back to Drive:
```python
# Copy the results back so you don't lose them!
!cp -r scripts/artifacts "/content/drive/MyDrive/Detector_Backup/"
```

---

## 📂 Option 2: Google Drive (The "Drag & Drop" Way)
**Best for:** If you don't want to use Git and just want to upload your whole folder.

### 1. Prepare your Drive
1.  Create a folder named `Main_Thesis-2` in your Google Drive.
2.  Upload your **entire** `student-humanizer-plus` folder into it.
3.  Ensure `Human.csv` is inside `Human_text/`.

### 2. Run this in a Colab Cell:
```python
# 1. Mount Drive
from google.colab import drive
drive.mount('/content/drive')

# 2. Go into your folder
%cd /content/drive/MyDrive/Main_Thesis-2/student-humanizer-plus

# 3. Install dependencies
!pip install -r requirements.txt  # (or install pandas sklearn manually)
!pip install pandas scikit-learn numpy joblib textstat nltk

# 4. Run Training
!python3 scripts/train_super_detector.py
```

**Advantage:** Your `model.joblib` and `metadata.pkl` are automatically saved directly to your Drive, since you are running *inside* the Drive folder.
