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
        "Quantum programming",
        "Markup language",
        # Not a PL
        "Autodesk 3ds Max",
        "XCore XS1",
        "Ch (computer programming)",
        "ColdFusion",
        # Too little information
        "Accent (programming language)",
        "Adenine (programming language)",
        "Agilent VEE",
        "Agora (programming language)",
        "AIMMS",
        "Apache Pig",
        "Apex (programming language)",
        "Argus (programming language)",
        "Averest",
        "Batch file",
        "Bertrand (programming language)",
        "BlooP and FlooP",
        "Cayenne (programming language)",
        "CESIL",
        "Céu (programming language)",
        "CFEngine",
        "CobolScript",
        "COMPASS",
        "Cryptol",
        "Cybil (programming language)",
        "Cypher Query Language",
        "CEEMAC",
        # Excluding shells
        "Bash (Unix shell)",
        "C Shell",
        "Control Language"
        # Excluding shading languages
        "Cg (programming language)",
    ]


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


def fetch_language_data(page_name):
    slug = slugify_page_name(page_name)
    cache_path = "./data/cache/langs/" + slug + ".pkl"

    cache = load_cache(cache_path)
    if cache is None:
        try:
            page = wptools.page(page_name)
            data = page.get().data
        except LookupError:
            print("Skipping " + page_name + " : page does not exist")
            return None

        save_cache(cache_path, data)
        return data
    else:
        return cache


if __name__ == "__main__":
    l = fetch_list_of_langs()
    print(l)

    data = fetch_language_data(l[0])
    print(data.keys())
    print(data["infobox"])
