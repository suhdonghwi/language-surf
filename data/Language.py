import re


def preprocess_wikitext(s):
    return s.replace("\n\n", "\n").replace("\n", " ")


def find_page_names(s):
    links = re.findall(r"\[\[([^\[\]]+)\]\]", s)
    page_names = []
    for link in links:
        page_names.append(link.split("|")[0].strip())

    return page_names


class Language:
    def __init__(self, raw_data, redirect_dict):
        self.id = raw_data.id

        self.label = raw_data.wikipedia_page.data["label"]
        self.description = preprocess_wikitext(raw_data.wikipedia_page.data["extext"])
        self.wikipedia_pageid = raw_data.wikipedia_page.data["pageid"]

        claim_groups = raw_data.wikidata_item.get_claim_groups()

        self.inception = None
        self.paradigm = None
        self.typing_discipline = None

        if "P571" in claim_groups:  # Inception
            inception_value = claim_groups["P571"][0].mainsnak.datavalue.value
            self.inception = {
                "time": inception_value["time"],
                "precision": inception_value["precision"],
            }

        if "P3966" in claim_groups:  # Programming paradigm
            self.paradigm = map(
                lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P3966"]
            )

        if "P7078" in claim_groups:  # Typing discipline
            self.typing_discipline = map(
                lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P7078"]
            )
