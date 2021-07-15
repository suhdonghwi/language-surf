import os.path
import wptools
import pickle
import re
import sqlite3

from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api

from exclude_list import exclude_list
from language_raw_data import LanguageRawData

from language import Language
from paradigm import Paradigm
from typing_discipline import TypingDiscipline


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
        .replace("′′", "doubleprime")
        .lower()
        .strip()
    )

    assert all(
        map(
            lambda l: l.isalnum() or l in [" ", "-", "!"],
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
    wikidata_dict = {}
    typing_id_set = set()
    paradigm_id_set = set()

    for raw_data in raw_data_list:
        redirect_dict[raw_data.wikipedia_page.data["title"].lower()] = raw_data.id
        if "redirects" in raw_data.wikipedia_page.data:
            for redirect in raw_data.wikipedia_page.data["redirects"]:
                redirect_dict[redirect["title"].lower()] = raw_data.id

        wikidata_dict[raw_data.wikidata_item.entity_id] = raw_data.id

        claim_groups = raw_data.wikidata_item.get_claim_groups()

        if "P3966" in claim_groups:  # Programming paradigm
            paradigm_id_set.update(
                map(lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P3966"])
            )

        if "P7078" in claim_groups:  # Typing discipline
            typing_id_set.update(
                map(lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P7078"])
            )

    paradigm_dict_cache_path = "./data/cache/dict/paradigm_dict.pkl"
    paradigm_dict = load_cache(paradigm_dict_cache_path)
    if paradigm_dict is None:
        paradigm_dict = {}
        for paradigm_id in paradigm_id_set:
            item = WikidataItem(get_entity_dict_from_api(paradigm_id))
            paradigm_dict[paradigm_id] = Paradigm(
                0, item.get_label(), item.get_description()
            )

        save_cache(paradigm_dict_cache_path, paradigm_dict)

    paradigm_dict.pop("Q4306983")  # multi-paradigm
    paradigm_dict.pop("Q905156")  # non-structured
    paradigm_dict["Q28920201"] = paradigm_dict[
        "Q28453809"
    ]  # purely functional language = purely functional
    paradigm_dict["Q28922858"] = paradigm_dict[
        "Q5127844"
    ]  # class-based language = class-based

    for (id, paradigm) in enumerate(set(paradigm_dict.values())):
        paradigm.id = id

    for (key, value) in paradigm_dict.items():
        print(key, value.name, value.id)

    print(paradigm_id_set)
    print(typing_id_set)


"""
    language_list = []
    for raw_data in raw_data_list:
        language_list.append(Language(raw_data, redirect_dict, wikidata_dict))

    with open("./data/cache/languages_data.pkl", "rb") as f:
        language_list = pickle.load(f)

    with open("./data/cache/paradigm.pkl", "rb") as f:
        paradigm_dict = pickle.load(f)

    for 

    typing_dict = {}
    for (id, typing_id) in enumerate(typing_list):
        item = WikidataItem(get_entity_dict_from_api(typing_id))
        typing_discipline = TypingDiscipline(
            id, item.get_label(), item.get_description()
        )

        typing_dict[typing_id] = typing_discipline
        print(typing_id, typing_discipline.name)

    with open("./data/cache/typing_discipline.pkl", "wb") as f:
        pickle.dump(typing_dict, f)

    for (id, paradigm_id) in enumerate(paradigm_list):
        item = WikidataItem(get_entity_dict_from_api(paradigm_id))
        paradigm = Paradigm(id, item.get_label(), item.get_description())

        paradigm_dict[paradigm_id] = paradigm
        print(paradigm_id, paradigm.name)
"""
