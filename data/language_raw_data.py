import wptools
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api


class LanguageRawData:
    def __init__(self, id, search_name):
        self.id = id

        page = wptools.page(search_name)
        self.wikipedia_page = page
        self.update()

    def update(self):
        self.wikipedia_page.get_query()
        self.wikipedia_page.get_parse()
        self.wikipedia_page.get_restbase()

        wikidata_id = self.wikipedia_page.data["wikidata_url"].split("/")[-1]
        wikidata_dict = get_entity_dict_from_api(wikidata_id)
        wikidata_item = WikidataItem(wikidata_dict)
        self.wikidata_item = wikidata_item
