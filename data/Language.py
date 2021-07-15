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
    def __init__(self, raw_data, redirect_dict, wikidata_dict):
        self.id = raw_data.id

        self.label = raw_data.wikipedia_page.data["label"]
        self.description = preprocess_wikitext(raw_data.wikipedia_page.data["extext"])
        self.wikipedia_pageid = raw_data.wikipedia_page.data["pageid"]

        def wikipedia_collect_id(page_names):
            result = []
            for page_name in page_names:
                if page_name.lower() in redirect_dict:
                    result.append(redirect_dict[page_name.lower()])

            return result

        self.influenced_by = set()
        self.influenced = set()

        infobox = raw_data.wikipedia_page.data["infobox"]
        if infobox is not None:
            if "influenced_by" in infobox:
                page_names = find_page_names(infobox["influenced_by"])
                self.influenced_by.update(wikipedia_collect_id(page_names))

            if "influenced" in infobox:
                page_names = find_page_names(infobox["influenced"])
                self.influenced.update(wikipedia_collect_id(page_names))

        claim_groups = raw_data.wikidata_item.get_claim_groups()

        self.inception = None
        self.paradigm = []
        self.typing_discipline = []

        if "P571" in claim_groups:  # Inception
            inception_value = claim_groups["P571"][0].mainsnak.datavalue.value
            self.inception = {
                "time": inception_value["time"],
                "precision": inception_value["precision"],
            }

        if "P3966" in claim_groups:  # Programming paradigm
            self.paradigm = list(
                map(lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P3966"])
            )

        if "P7078" in claim_groups:  # Typing discipline
            self.typing_discipline = list(
                map(lambda x: x.mainsnak.datavalue.value["id"], claim_groups["P7078"])
            )

        def wikidata_collect_id(id):
            result = []

            if id in claim_groups:
                for claim in claim_groups[id]:
                    wikidata_id = claim.mainsnak.datavalue.value["id"]
                    if wikidata_id in wikidata_dict:
                        result.append(wikidata_dict[wikidata_id])

            return result

        self.influenced_by.update(wikidata_collect_id("P144"))
        self.influenced_by.update(wikidata_collect_id("P737"))
