class Language:
    def __init__(self, data):
        self.id = data["pageid"]
        self.label = data["label"]
        self.description = data["exrest"]

        self.logo = data.get("logo")
