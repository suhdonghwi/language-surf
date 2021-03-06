import os.path
import wptools
import pickle
import json

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
        data = list(filter(lambda l: is_valid_page_name(l), data))

        save_cache(cache_path, data)

        return data
    else:
        return cache


def slugify_page_name(page_name):
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
            lambda l: l.isalnum() or l in [" ", "-", "!", "(", ")"],
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


def fetch_all_data():
    page_name_list = fetch_list_of_langs()

    # Page does not exist
    page_name_list.remove("Hugo (programming language)")
    page_name_list.remove("Silver (programming language)")

    raw_data_list = []
    for (id, lang) in enumerate(page_name_list):
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
    paradigm_dict.pop("Q380679")  # dynamic programming
    paradigm_dict.pop("Q609588")  # component-based software engineering
    paradigm_dict.pop("Q4117397")
    paradigm_dict["Q28920201"] = paradigm_dict[
        "Q28453809"
    ]  # purely functional language = purely functional
    paradigm_dict["Q28922858"] = paradigm_dict[
        "Q5127844"
    ]  # class-based language = class-based
    paradigm_dict["Q1931693"] = paradigm_dict[
        "Q232661"
    ]  # parallel programming = parallel computing

    for (id, paradigm) in enumerate(set(paradigm_dict.values())):
        paradigm.id = id

    typing_dict_cache_path = "./data/cache/dict/typing_dict.pkl"
    typing_dict = load_cache(typing_dict_cache_path)
    if typing_dict is None:
        typing_dict = {}
        for typing_id in typing_id_set:
            item = WikidataItem(get_entity_dict_from_api(typing_id))
            typing_dict[typing_id] = TypingDiscipline(
                0, item.get_label(), item.get_description()
            )

        save_cache(typing_dict_cache_path, typing_dict)

    typing_dict["Q6495507"] = typing_dict["Q1268978"]  # latent typing = dynamic typing
    typing_dict["Q997433"] = typing_dict[
        "Q56232424"
    ]  # dependent type = dependently typed programming
    typing_dict.pop("Q66310394")  # typeless
    typing_dict.pop("Q736866")  # safety typing
    typing_dict.pop("Q180868")  # prototype-based programming

    for (id, typing) in enumerate(set(typing_dict.values())):
        typing.id = id

    language_list = []
    for raw_data in raw_data_list:
        lang = Language(
            raw_data, redirect_dict, wikidata_dict, paradigm_dict, typing_dict
        )
        language_list.append(lang)

    return (language_list, set(paradigm_dict.values()), set(typing_dict.values()))


def serialize_paradigm(paradigm_list):
    result = {}

    for paradigm in paradigm_list:
        result[paradigm.id] = {
            "name": paradigm.name,
            "description": paradigm.description,
        }

    return json.dumps(result)


def serialize_typing(typing_list):
    result = {}

    for typing in typing_list:
        result[typing.id] = {
            "name": typing.name,
            "description": typing.description,
        }

    return json.dumps(result)


def serialize_language(language_list):
    result = {}

    for lang in language_list:
        result[lang.id] = {
            "label": lang.label,
            "wikipedia_pageid": lang.wikipedia_pageid,
            "inception": lang.inception,
            "paradigm": list(map(lambda p: p.id, lang.paradigm)),
            "typing": list(map(lambda t: t.id, lang.typing_discipline)),
            "description": lang.description,
        }

    return json.dumps(result, ensure_ascii=False)


def serialize_influence(language_list):
    temp = set()

    for lang in language_list:
        for source in lang.influenced_by:
            temp.add((source, lang.id))

        for target in lang.influenced:
            temp.add((lang.id, target))

    result = []
    for (source, target) in temp:
        result.append({"source": source, "target": target})

    return json.dumps(result)


if __name__ == "__main__":
    (language_list, paradigm_list, typing_list) = fetch_all_data()

    basePath = "./src/data/json/"
    with open(basePath + "paradigm.json", "w") as f:
        f.write(serialize_paradigm(paradigm_list))

    with open(basePath + "typing.json", "w") as f:
        f.write(serialize_typing(typing_list))

    with open(basePath + "language.json", "w") as f:
        f.write(serialize_language(language_list))

    with open(basePath + "influence.json", "w") as f:
        f.write(serialize_influence(language_list))
