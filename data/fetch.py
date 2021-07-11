import os.path
import wptools
import pickle
import re


def load_cache(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    else:
        return None


def save_cache(path, data):
    with open(path, "wb") as f:
        pickle.dump(data, f)


def is_valid_page_name(page_name):
    return not page_name.startswith(
        ("List of", "Lists of", "Comparison of", "History of")
    ) and page_name not in [
        "Programming language",
        "Esoteric programming language",
        "Non-English-based programming languages",
        "Timeline of programming languages",
        "Generational list of programming languages",
    ]


def fetch_list_of_langs(page_name="List of programming languages"):
    cache_path = "./data/cache/list.pkl"
    cache = load_cache(cache_path)
    if cache is None:
        page = wptools.page(page_name)
        data = page.get_query().data["links"]
        data = list(filter(lambda l: is_valid_page_name(l), data))

        save_cache(cache_path, data)

        return data
    else:
        return cache


def slugify_page_name(page_name):
    page_name = re.sub(r"\(.*\)", "", page_name)
    page_name = (
        page_name.replace("+", "plus")
        .replace("*", "star")
        .replace(".", "dot")
        .replace("--", "minusminus")
        .replace("/", "-")
        .replace("!", "")
        .replace(":", "")
        .lower()
    )
    return page_name


if __name__ == "__main__":
    s = set()

    for lang in fetch_list_of_langs():
        print(lang, "->", slugify_page_name(lang))
        for ch in lang:
            if not ch.isdigit() and not ch.isalpha():
                s.add(ch)

    print(s)