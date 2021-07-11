import os.path
import wptools
import pickle


def load_cache(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    else:
        return None


def save_cache(path, data):
    with open(path, "wb") as f:
        pickle.dump(data, f)


def fetch_list_of_langs(page_name="List of programming languages"):
    cache_path = "./data/cache/list.pkl"
    cache = load_cache(cache_path)
    if cache is None:
        page = wptools.page(page_name)
        data = page.get_query().data["links"]
        save_cache(cache_path, data)

        return data
    else:
        return cache


if __name__ == "__main__":
    print(fetch_list_of_langs())
