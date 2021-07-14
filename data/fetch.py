import os.path
import wptools
import pickle
import re

from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api

from exclude_list import exclude_list
from language_raw_data import LanguageRawData
from language import Language


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
    return (
        not page_name.startswith(("List of", "Lists of", "Comparison of", "History of"))
        and page_name not in exclude_list
    )


def fetch_list_of_langs(page_name="List of programming languages"):
    cache_path = "./data/cache/list.pkl"
    cache = load_cache(cache_path)
    if cache is None:
        page = wptools.page(page_name)
        data = page.get().data["links"]
        print(data)
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
        .replace(":", "-")
        .replace("!", "")
        .replace("′′", "doubleprime")
        .lower()
        .strip()
    )

    assert all(
        map(
            lambda l: l.isalnum() or l == " " or l == "-",
            list(page_name),
        )
    )
    return page_name


def fetch_language_raw_data(id, page_name):
    slug = slugify_page_name(page_name)
    cache_path = "./data/cache/raw_data/" + slug + ".pkl"

    cache = load_cache(cache_path)
    if cache is None:
        try:
            data = LanguageRawData(id, page_name)
        except LookupError:
            print("Skipping " + page_name + " : page does not exist")
            return None

        save_cache(cache_path, data)
        return data
    else:
        return cache


if __name__ == "__main__":
    lang_list = fetch_list_of_langs()
    print(lang_list)

    raw_data_list = []
    for (id, lang) in enumerate(lang_list):
        raw_data = fetch_language_raw_data(id, lang)
        if raw_data is not None:
            raw_data_list.append(raw_data)

    redirect_dict = {}
    for raw_data in raw_data_list:
        for redirect in raw_data.wikipedia_page.data["redirects"]:
            redirect["title"]

    for raw_data in raw_data_list:
        lang = Language(raw_data, raw_data_list)
