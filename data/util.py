import pickle
import language_raw_data


def load_lang(path):
    with open("./cache/raw_data/" + path, "rb") as f:
        return pickle.load(f)
